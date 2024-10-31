// 查询分笔成交
// 参数：市场代码， 股票代码，起始位置， 数量 如： 0,000001,0,10

import bufferpack from "bufferpack";
import { BaseParser } from "./base";
import { getPrice, getTime, padStart, parsePrice } from "../utils";

export class GetTransactionData extends BaseParser {
  setParams(market: number, code: string, start: number, count: number) {
    const pkg = Buffer.from("0c17080101010e000e00c50f", "hex");
    const pkgParam = bufferpack.pack("<H6sHH", [market, code, start, count]);
    this.sendPkg = Buffer.concat([pkg, pkgParam]);
  }

  parseResponse(bodyBuf: Buffer) {
    let pos = 0;
    const [count] = bufferpack.unpack("<H", bodyBuf.slice(pos, pos + 2)) as [
      number,
    ];
    pos += 2;

    const ticks = [];

    let lastPrice = 0;

    for (let i = 0; i < count; i++) {
      // ??? get_time
      // \x80\x03 = 14:56
      // console.log('bodyBuf.length, pos', i, bodyBuf.length, pos)
      let hour, minute, priceRaw, vol, num, buyOrSell;
      [hour, minute, pos] = getTime(bodyBuf, pos);
      [priceRaw, pos] = getPrice(bodyBuf, pos);
      [vol, pos] = getPrice(bodyBuf, pos);
      [num, pos] = getPrice(bodyBuf, pos);
      [buyOrSell, pos] = getPrice(bodyBuf, pos);
      [, pos] = getPrice(bodyBuf, pos);

      lastPrice += priceRaw;

      ticks.push({
        time: padStart(hour, 2) + ":" + padStart(minute, 2), // "%02d:%02d" % (hour, minute)
        price: parsePrice(lastPrice / 100),
        volume: vol,
        num,
        buyOrSell,
      });
    }

    return ticks;
  }

  setup() {}
}
