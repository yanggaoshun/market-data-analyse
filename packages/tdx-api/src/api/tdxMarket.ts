import { BaseSocketClient } from "../client/baseSocket";
import { marketHosts, marketIds } from "../config/marketHosts";
import { GetCompanyInfoCategory } from "../parse/getCompanyInfoCategory";
import { GetCompanyInfoContent } from "../parse/getCompanyInfoContent";
import { GetExRightInfo } from "../parse/getExRightInfo";
import { GetFinanceInfo } from "../parse/getFinanceInfo";
import { GetHistoryMinuteTimeData } from "../parse/getHistoryMinuteTimeData";
import { GetHistoryTransactionData } from "../parse/getHistoryTransactionData";
import { GetIndexBars } from "../parse/getIndexBars";
import { GetMinuteTimeData } from "../parse/getMinuteTimeData";
import { GetSecurityBars } from "../parse/getSecurityBars";
import { GetSecurityCount } from "../parse/getSecurityCount";
import { GetSecurityList } from "../parse/getSecurityList";
import { GetSecurityQuotes } from "../parse/getSecurityQuotes";
import { GetTransactionData } from "../parse/getTransactionData";
import { SetupCmd1, SetupCmd2, SetupCmd3 } from "../parse/setupCommands";
import { EMarketType, EPeriodType } from "../types/enum";
import { calcEndTimestamp, calcStartTimestamp, parseSymbol } from "../utils";

export default class TdxMarket extends BaseSocketClient {
  doPing() {
    return this.getGateways(marketHosts);
  }

  async doHeartbeat() {
    return this.getSecurityCount(marketIds[Math.round(Math.random())]);
  }

  async setup() {
    await new SetupCmd1(this.client).callApi();
    await new SetupCmd2(this.client).callApi();
    await new SetupCmd3(this.client).callApi();
  }

  // api list
  async getSecurityCount(marketId: keyof typeof EMarketType) {
    const cmd = new GetSecurityCount(this.client);
    cmd.setParams(EMarketType[marketId]);
    return await cmd.callApi();
  }

  async getSecurityList(marketId: keyof typeof EMarketType, start: number) {
    const cmd = new GetSecurityList(this.client);
    cmd.setParams(EMarketType[marketId], start);
    return await cmd.callApi();
  }

  /**
   * symbols的长度最大为80, 若超过80只股票则只查询前80只股票的quote
   * @param  {...any} symbols
   * ...symbols: 三种形式
   * 'SZ.000001'
   * ['SZ.000001']
   * 'SZ.000001', 'SZ.600519'
   */
  async getSecurityQuotes(...symbols: any[]) {
    let params;
    if (symbols.length === 1) {
      const firstArg = symbols[0];
      if (typeof firstArg === "string") {
        const { marketId, code } = parseSymbol(firstArg);
        params = [[marketId, code]];
      } else if (Array.isArray(firstArg)) {
        params = firstArg.map((arg) => {
          const { marketId, code } = parseSymbol(arg);
          return [marketId, code];
        });
      }
    } else {
      params = symbols.map((arg) => {
        const { marketId, code } = parseSymbol(arg);
        return [marketId, code];
      });
    }

    const cmd = new GetSecurityQuotes(this.client);
    cmd.setParams(params as any);
    return await cmd.callApi();
  }

  async getFinanceInfo(symbol: string) {
    const { code, marketId } = parseSymbol(symbol);
    const cmd = new GetFinanceInfo(this.client);
    cmd.setParams(marketId, code);
    return await cmd.callApi();
  }

  async getExRightInfo(symbol: string) {
    const { code, marketId } = parseSymbol(symbol);
    const cmd = new GetExRightInfo(this.client);
    cmd.setParams(marketId, code);
    return await cmd.callApi();
  }

  async getSecurityBars(
    period: EPeriodType,
    symbol: string,
    start: number,
    count: number,
  ) {
    const { code, marketId } = parseSymbol(symbol);
    const cmd = new GetSecurityBars(this.client);
    cmd.setParams(period, marketId, code, start, count);
    return await cmd.callApi();
  }

  async getIndexBars(
    period: EPeriodType,
    symbol: string,
    start: number,
    count: number,
  ) {
    const { code, marketId } = parseSymbol(symbol);
    const cmd = new GetIndexBars(this.client);
    cmd.setParams(period, marketId, code, start, count);
    return await cmd.callApi();
  }

  async getMinuteTimeData(symbol: string) {
    const { code, marketId } = parseSymbol(symbol);
    const cmd = new GetMinuteTimeData(this.client);
    cmd.setParams(marketId, code);
    return await cmd.callApi();
  }

  async getHistoryMinuteTimeData(symbol: string, date: string) {
    const { code, marketId } = parseSymbol(symbol);
    const cmd = new GetHistoryMinuteTimeData(this.client);
    cmd.setParams(marketId, code, date);
    return await cmd.callApi();
  }

  async getTransactionData(symbol: string, start: number, count: number) {
    const { code, marketId } = parseSymbol(symbol);
    const cmd = new GetTransactionData(this.client);
    cmd.setParams(marketId, code, start, count);
    return await cmd.callApi();
  }

  async getHistoryTransactionData(
    symbol: string,
    start: number,
    count: number,
    date: string,
  ) {
    const { code, marketId } = parseSymbol(symbol);
    const cmd = new GetHistoryTransactionData(this.client);
    cmd.setParams(marketId, code, start, count, date);
    return await cmd.callApi();
  }

  async getCompanyInfoCategory(symbol: string) {
    const { code, marketId } = parseSymbol(symbol);
    const cmd = new GetCompanyInfoCategory(this.client);
    cmd.setParams(marketId, code);
    return await cmd.callApi();
  }

  async getCompanyInfoContent(
    symbol: string,
    filename: string,
    start: number,
    length: number,
  ) {
    const { code, marketId } = parseSymbol(symbol);
    const cmd = new GetCompanyInfoContent(this.client);
    cmd.setParams(marketId, code, filename, start, length);
    return await cmd.callApi();
  }

  /**
   * 按日期查询count根证券K线
   * 若有startDatetime、count 且无 endDatetime, 则返回startDatetime之后的count根K线
   * 若有endDatetime、count 且无 startDatetime, 则返回endDatetime之前的count根K线
   * 若有startDatetime、endDatetime 且无 count, 则返回startDatetime和endDatetime之间的K线
   * 若有startDatetime 且无 endDatetime、count, 则返回startDatetime到当前时间之间的K线
   * @param {EPeriodType} period
   * @param {String} symbol
   * @param {String} startDatetime
   * @param {String} endDatetime
   * @param {Integer} count
   */
  async findSecurityBars(
    period = EPeriodType.D,
    symbol: string,
    startDatetime: string,
    endDatetime: string,
    count: number,
  ) {
    // 具体详情参见 https://github.com/rainx/pytdx/issues/5
    // 具体详情参见 https://github.com/rainx/pytdx/issues/21

    // https://github.com/rainx/pytdx/issues/33
    // 0 - 深圳， 1 - 上海

    let startTimestamp: number, endTimestamp: number;

    startTimestamp = calcStartTimestamp(startDatetime);

    endTimestamp = calcEndTimestamp(endDatetime);

    let bars: any[] = [];
    let i = 0;
    while (true) {
      let list = (await this.getSecurityBars(
        period,
        symbol,
        i++ * 700,
        700,
      )) as any[]; // i++ * 8 => i * 8; i++;

      if (!list || !list.length) {
        break;
      }

      if (list.length) {
        const firstBar = list[0];
        const lastBar = list[list.length - 1];
        const firstTimestamp = new Date(firstBar.datetime).getTime();
        const lastTimestamp = new Date(lastBar.datetime).getTime();

        if (endTimestamp && firstTimestamp >= endTimestamp) {
          continue;
        }

        if (startTimestamp && startTimestamp > lastTimestamp) {
          break;
        }

        list = list.filter((bar) => {
          const timestamp = new Date(bar.datetime).getTime();
          if (startTimestamp && endTimestamp) {
            return timestamp >= startTimestamp && timestamp <= endTimestamp;
          } else if (startTimestamp) {
            return timestamp >= startTimestamp;
          } else if (endTimestamp) {
            return timestamp <= endTimestamp;
          }
        });
        bars = list.concat(bars);

        if (
          !startTimestamp &&
          endTimestamp &&
          count &&
          count > 0 &&
          bars.length >= count
        ) {
          break;
        }
      }
    }

    if (startTimestamp && endTimestamp) {
      return count && count > 0 ? bars.slice(0, count) : bars;
    } else if (startTimestamp) {
      return count && count > 0 ? bars.slice(0, count) : bars;
    } else if (endTimestamp) {
      return count && count > 0 ? bars.slice(-count) : bars;
    }

    return bars;
  }

  /**
   * 按日期查询count根指数K线
   * 若有startDatetime、count 且无 endDatetime, 则返回startDatetime之后的count根K线
   * 若有endDatetime、count 且无 startDatetime, 则返回endDatetime之前的count根K线
   * 若有startDatetime、endDatetime 且无 count, 则返回startDatetime和endDatetime之间的K线
   * 若有startDatetime 且无 endDatetime、count, 则返回startDatetime到当前时间之间的K线
   * @param {String} period 1m, 15m, 30m, H, D, W, M, Q, Y
   * @param {String} symbol
   * @param {String} startDatetime
   * @param {String} endDatetime
   * @param {Integer} count
   */
  async findIndexBars(
    period = EPeriodType.D,
    symbol: string,
    startDatetime: string,
    endDatetime: string,
    count: number,
  ) {
    // 具体详情参见 https://github.com/rainx/pytdx/issues/5
    // 具体详情参见 https://github.com/rainx/pytdx/issues/21

    // https://github.com/rainx/pytdx/issues/33
    // 0 - 深圳， 1 - 上海

    let startTimestamp: number, endTimestamp: number;

    startTimestamp = calcStartTimestamp(startDatetime);

    endTimestamp = calcEndTimestamp(endDatetime);

    let bars: any[] = [];
    let i = 0;
    while (true) {
      let list = (await this.getIndexBars(
        period,
        symbol,
        i++ * 700,
        700,
      )) as any[]; // i++ * 8 => i * 8; i++;

      if (!list || !list.length) {
        break;
      }

      if (list.length) {
        const firstBar = list[0];
        const lastBar = list[list.length - 1];
        const firstTimestamp = new Date(firstBar.datetime).getTime();
        const lastTimestamp = new Date(lastBar.datetime).getTime();

        if (endTimestamp && firstTimestamp >= endTimestamp) {
          continue;
        }

        if (startTimestamp && startTimestamp > lastTimestamp) {
          break;
        }

        list = list.filter((bar) => {
          const timestamp = new Date(bar.datetime).getTime();
          if (startTimestamp && endTimestamp) {
            return timestamp >= startTimestamp && timestamp <= endTimestamp;
          } else if (startTimestamp) {
            return timestamp >= startTimestamp;
          } else if (endTimestamp) {
            return timestamp <= endTimestamp;
          }
        });
        bars = list.concat(bars);

        if (
          !startTimestamp &&
          endTimestamp &&
          count &&
          count > 0 &&
          bars.length >= count
        ) {
          break;
        }
      }
    }

    if (startTimestamp && endTimestamp) {
      return count && count > 0 ? bars.slice(0, count) : bars;
    } else if (startTimestamp) {
      return count && count > 0 ? bars.slice(0, count) : bars;
    } else if (endTimestamp) {
      return count && count > 0 ? bars.slice(-count) : bars;
    }

    return bars;
  }

  /**
   * 按日期查询count根K线
   * 若有startDatetime、count 且无 endDatetime, 则返回startDatetime之后的count根K线
   * 若有endDatetime、count 且无 startDatetime, 则返回endDatetime之前的count根K线
   * 若有startDatetime、endDatetime 且无 count, 则返回startDatetime和endDatetime之间的K线
   * 若有startDatetime 且无 endDatetime、count, 则返回startDatetime到当前时间之间的K线
   * 不再区分是指数还是股票, 由程序解析symbol来自动区分, 对调用者屏蔽差异
   * 注: 这里有个问题 因为tdx的官网的最大显示就是24000条 所以1min和5min数据 最多只能取24000条左右 这个没法再多了 其他的没啥影响
   * @param {String} period 1m, 15m, 30m, H, D, W, M, Q, Y
   * @param {String} symbol
   * @param {String} startDatetime
   * @param {String} endDatetime
   * @param {Integer} count
   */
  findBars(
    period = EPeriodType.D,
    symbol: string,
    startDatetime: string,
    endDatetime: string,
    count: number,
  ) {
    const { isIndex } = parseSymbol(symbol);
    return isIndex
      ? this.findIndexBars(period, symbol, startDatetime, endDatetime, count)
      : this.findSecurityBars(
          period,
          symbol,
          startDatetime,
          endDatetime,
          count,
        );
  }

  async findStockList(marketId?: "SH" | "SZ"): Promise<any[]> {
    if (marketId) {
      const list: any[] = [],
        step = 1000;
      const regMap = {
        SH: /^6[08]\d{4}$/,
        SZ: /^00\d{4}|30\d{4}$/,
      };
      const reg = regMap[marketId];

      let i = 0,
        tmpList;

      do {
        tmpList = (await this.getSecurityList(marketId, i++ * step)) as any[];
        tmpList.forEach((item) => {
          if (reg.test(item.code)) {
            item.symbol = marketId + "." + item.code;
            list.push(item);
          }
        });
      } while (tmpList.length);

      return list;
    } else {
      return [
        ...(await this.findStockList("SH")),
        ...(await this.findStockList("SZ")),
      ];
    }
  }
}
