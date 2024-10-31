import net from "net";
import { PromiseSocket } from "promise-socket";
import { sleep } from "../utils";
import { logger } from "../log";
import { SOCKET_CONFIG } from "../config/socket.config";

export abstract class BaseSocketClient {
  // 请求队列
  protected reqQueue: any[] = [];
  protected heartbeatCount: number = 0;
  protected lock: boolean = false;
  protected client: PromiseSocket<net.Socket> | null = null;
  protected host: string = "";
  protected port: number = 0;
  // 重连次数
  reconnectTimes: number = 0;

  lastAckTime: number = 0;

  constructor(protected readonly onTimeout?: () => void) {
    this.initClient();
  }

  private initClient() {
    if (this.client) {
      this.client.destroy();
    }
    const socket = new net.Socket();
    const promiseSocket = new PromiseSocket(socket);
    promiseSocket.setTimeout(SOCKET_CONFIG.idleTimeout);
    promiseSocket.socket.once("timeout", () => {
      logger.error(
        `connection is timeout, max idle time is ${SOCKET_CONFIG.idleTimeout} ms.`,
      );
      this.onTimeout && this.onTimeout();
      this.initClient(); // timeout后promiseSocket被destroy掉了, 需要重建socket
      this.tryReconnect();
    });

    this.client = promiseSocket;
  }

  protected abstract doPing(): Promise<[string, string, number, number][]>;
  protected abstract doHeartbeat(): Promise<any>;
  protected abstract setup(): Promise<void>;

  /**
   * 连接服务器网关
   * 若传入了host和port参数则使用参数建立连接, 若未传参数并且this.autoSelectBestGateway为true则自动选择最优网关建立连接,
   * 若既未传参且this.autoSelectBestGateway为false则抛出异常
   * @param {String} host 服务器ip地址   可选
   * @param {Integer} port 服务器端口    可选
   */
  async connect(host?: string, port?: number): Promise<boolean> {
    if (SOCKET_CONFIG.autoSelectBestGateway && !host && !port) {
      const gateways = await this.doPing();
      const firstGateWat = gateways[0];
      if (firstGateWat) {
        const [name, host, port, time] = firstGateWat;
        logger.info(
          "auto select best gateway is: %s, %dms.",
          name + ":" + host + ":" + port,
          time,
        );
        this.host = host;
        this.port = port;
      }
    } else if (host && port) {
      this.host = host;
      this.port = port;
    }

    logger.info("connecting to server %s on port %d", host, port);

    let connected: boolean = false;
    const t = Date.now();

    if (!this.client) {
      logger.error("client is not initialized.");
      return false;
    }
    try {
      await this.client.connect(this.port, this.host);
      this.reconnectTimes = 0;
      connected = true;
    } catch (e) {
      logger.error(e);
    }

    if (!connected) {
      this.reconnectTimes++;
      return await this.tryReconnect();
    }

    logger.info("socket connected, spent %d ms.", Date.now() - t);

    if (SOCKET_CONFIG.needSetup) {
      await this.setup();
    }

    this.lastAckTime = Date.now();

    SOCKET_CONFIG.useHeartbeat && this.checkHeartbeat();

    return connected;
  }

  async ping(host: string, port: number) {
    const socket = new net.Socket();
    const promiseSocket = new PromiseSocket(socket);
    promiseSocket.setTimeout(SOCKET_CONFIG.pingTimeout);
    promiseSocket.socket.once("timeout", () => {
      logger.error("ping timeout %s", host + ":" + port);
    });
    const t = Date.now();
    try {
      await promiseSocket.connect({ host, port });
      const time = Date.now() - t;
      promiseSocket.destroy();
      logger.info("ping %s, %dms", host + ":" + port, time);
      return time;
    } catch (e) {
      logger.error(e);
    }
  }

  async getGateways(hosts: [string, string, number][]) {
    const accessibleGateways: [string, string, number, number][] = [];

    for (let gateway of hosts) {
      const [, host, port] = gateway;
      const time = await this.ping(host, port);
      if (typeof time === "number") {
        accessibleGateways.push([...gateway, time]);
      }
    }

    accessibleGateways.sort(
      (
        a: [string, string, number, number],
        b: [string, string, number, number],
      ) => {
        return a[3] - b[3] < 0 ? -1 : 1;
      },
    );

    return accessibleGateways;
  }

  async tryReconnect(): Promise<boolean> {
    if (SOCKET_CONFIG.reconnectInterval < 0 || !this.host || !this.port) {
      return Promise.reject(new Error("no available gateway."));
    }

    // 达到最大重连次数
    if (this.reconnectTimes >= SOCKET_CONFIG.maxReconnectTimes) {
      if (SOCKET_CONFIG.autoSelectBestGateway) {
        // 重新选择最优服务器后再尝试重连
        return this.connect();
      } else {
        // 尝试重连失败
        logger.error(
          "failed to connect to server %s on %d, tried %d times.",
          this.host,
          this.port,
          SOCKET_CONFIG.maxReconnectTimes,
        );
        return Promise.reject(new Error("no available gateway."));
      }
    }

    await sleep(SOCKET_CONFIG.reconnectInterval);
    return await this.connect(this.host, this.port);
  }

  private disconnect() {
    if (this.client) {
      this.client.destroy();
      logger.info("disconnected");
    }
  }

  close() {
    this.disconnect();
  }

  // 心跳检测
  async checkHeartbeat() {
    const diff = Date.now() - this.lastAckTime;

    if (diff >= SOCKET_CONFIG.heartbeatInterval) {
      await this.doHeartbeat();
      this.heartbeatCount++;
      logger.info(
        "heart beat count %d, time diff %d ms.",
        this.heartbeatCount,
        diff,
      );
    }

    setTimeout(() => this.checkHeartbeat(), SOCKET_CONFIG.heartbeatInterval);
  }

  async checkQueue() {
    const firstReq = this.reqQueue[0];
    if (firstReq && !this.lock) {
      this.lock = true;
      const [resolve, reject, target, thisArg, argumentsList] = firstReq;
      this.lastAckTime = Date.now(); // 更新 ack time
      try {
        this.reqQueue.shift();
        const data = await target.apply(thisArg, argumentsList);
        Promise.resolve().then(() => {
          this.lock = false;
          return this.checkQueue();
        });
        resolve(data);
      } catch (e) {
        Promise.resolve().then(() => {
          this.lock = false;
          return this.checkQueue();
        });
        reject(e);
      }
    }
  }
}
