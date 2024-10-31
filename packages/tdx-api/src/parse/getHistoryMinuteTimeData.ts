// 查询历史分时行情
// 参数：市场代码， 股票代码，时间 如： 0,'000001',20161209 或 1,'600300',20161209

import { getPrice } from "../utils";
import { BaseParser } from "./base";
import bufferpack from 'bufferpack';

export class GetHistoryMinuteTimeData extends BaseParser {
  /**
   * @param {*} market 0/1
   * @param {*} code '000001'
   * @param {*} date 20161201 类似这样的整型
   */
  setParams(market: number, code: string, date: number | string) {
    if (typeof date === 'string') {
      date = +date;
    }

    const pkg = Buffer.from('0c01300001010d000d00b40f', 'hex');
    const pkgParam = bufferpack.pack('<IB6s', [date, market, code]);
    this.sendPkg = Buffer.concat([pkg, pkgParam]);
  }

  parseResponse(bodyBuf: Buffer) {
    let pos = 0;
    const [num] = bufferpack.unpack('<H', bodyBuf.slice(pos, pos + 2)) as number[]; // (num, ) = struct.unpack("<H", bodyBuf[:2])
    let lastPrice = 0;
    // 跳过了4个字节，实在不知道是什么意思
    pos += 6;
    const prices = [];
    for (let i = 0; i < num; i++) {
      let priceRaw, reversed1, vol;
      [ priceRaw, pos ] = getPrice(bodyBuf, pos);
      [ reversed1, pos ] = getPrice(bodyBuf, pos);
      [ vol, pos ] = getPrice(bodyBuf, pos);
      lastPrice += priceRaw;

      prices.push({
        price: lastPrice / 100,
        volume: vol
      });
    }
    return prices;
  }

  setup() {}
}
