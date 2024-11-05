// 获取指数k线

// 获取指数k线, 参数:
// category-> K线种类
// 0 5分钟K线
// 1 15分钟K线
// 2 30分钟K线
// 3 1小时K线
// 4 日K线
// 5 周K线
// 6 月K线
// 7 1分钟
// 8 1分钟K线
// 9 日K线
// 10 季K线
// 11 年K线
// market -> 市场代码 0:深圳，1:上海
// stockCode -> 证券代码;
// start -> 指定的范围开始位置; count -> 用户要请求的 K 线数目
// 如：9,1,'000001',0,100

// param: category=9, market=1, stockcode=000001, start=0, count=10

// In [101]: l[12:19]
// Out[101]: bytearray(b'xD\x9eI\xbe\xf7\nR')

// should be :

// 1296527
// 149215477760.00000

// bytearray(b'\xa8\xa9\xa4I\x10R\rR') = 1348917 151741792256.00000

import { logger } from "../log";
import { EPeriodType } from "../types/enum";
import { formatDateTime, getDateTime, getPrice, getVolume, parsePrice } from "../utils";
import { BaseParser } from "./base";
import bufferpack from 'bufferpack';

export class GetIndexBars extends BaseParser {
  private category: EPeriodType = EPeriodType.D;
  setParams(category: EPeriodType, market: number, code: string, start: number, count: number) {
    this.category = category

    const values = [
      0x10c,
      0x01016408,
      0x1c,
      0x1c,
      0x052d,
      market,
      code,
      category,
      1,
      start,
      count,
      0, 0, 0  // I + I +  H total 10 zero
    ]

    const pkg = bufferpack.pack('<HIHHHH6sHHHHIIH', values)
    this.sendPkg = pkg
  }

  parseResponse(bodyBuf: Buffer) {
    let pos = 0;

    const [count] = bufferpack.unpack('<H', bodyBuf.slice(0, 2)) as number[];
    pos += 2;

    const klines = [];

    let preDiffBase = 0;

    for (let i = 0; i < count; i++) {
      let year, month, day, hour, minute, priceOpenDiff, priceCloseDiff, priceHighDiff, priceLowDiff;
      // console.log(pos)
      [year, month, day, hour, minute, pos] = getDateTime(this.category, bodyBuf, pos);
      [priceOpenDiff, pos] = getPrice(bodyBuf, pos);
      [priceCloseDiff, pos] = getPrice(bodyBuf, pos);
      [priceHighDiff, pos] = getPrice(bodyBuf, pos);
      [priceLowDiff, pos] = getPrice(bodyBuf, pos);

      const [volRaw] = bufferpack.unpack('<I', bodyBuf.slice(pos, pos + 4)) as number[];
      const vol = getVolume(volRaw);

      pos += 4;
      const [dbvolRaw] = bufferpack.unpack('<I', bodyBuf.slice(pos, pos + 4)) as number[];
      const dbvol = getVolume(dbvolRaw);
      pos += 4;

      const [upCount, downCount] = bufferpack.unpack('<HH', bodyBuf.slice(pos, pos + 4));
      pos += 4;

      const open = this.calcPrice(priceOpenDiff, preDiffBase);

      priceOpenDiff += preDiffBase;

      const close = this.calcPrice(priceOpenDiff, priceCloseDiff);
      const high = this.calcPrice(priceOpenDiff, priceHighDiff);
      const low = this.calcPrice(priceOpenDiff, priceLowDiff);

      preDiffBase = priceOpenDiff + priceCloseDiff;

      klines.push({
        open: parsePrice(open),
        close: parsePrice(close),
        high: parsePrice(high),
        low: parsePrice(low),
        volume: vol,
        dbvol,
        year,
        month,
        day,
        hour,
        minute,
        datetime: formatDateTime(year, month, day, hour, minute, 'yyyy-MM-dd hh:mm:ss'),
        upCount,
        downCount
      });
      logger().info(klines[i])
    }

    return klines
  }

  setup() {}

  calcPrice(basePrice: number, diff: number) {
    return (basePrice + diff) / 1000
  }

}
