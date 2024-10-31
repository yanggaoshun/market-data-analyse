export const SOCKET_CONFIG = {
   // 是否启用心跳检测
   useHeartbeat: true,
   // 心跳间隔
   heartbeatInterval: 15000,
   // 最大重连次数
   maxReconnectTimes: 5,
   // 重连间隔
   reconnectInterval: 3000,
   // 自动选择最优网关
   autoSelectBestGateway: true,
   // 空闲超时
   idleTimeout: 30000,
   // ping超时时间
   pingTimeout: 100,

   needSetup: true,
}
