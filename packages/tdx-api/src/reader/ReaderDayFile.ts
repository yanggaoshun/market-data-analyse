import ReaderBase from "./BaseReader";
import dayjs from "dayjs";
import type { IDayData } from "../types/day";

/**
 *   每32个字节为一天数据
    每4个字节为一个字段，每个字段内低字节在前
    00 ~ 03 字节：年月日, 整型
    04 ~ 07 字节：开盘价*100， 整型
    08 ~ 11 字节：最高价*100,  整型
    12 ~ 15 字节：最低价*100,  整型
    16 ~ 19 字节：收盘价*100,  整型
    20 ~ 23 字节：成交额（元），float型
    24 ~ 27 字节：成交量（股），整型
    28 ~ 31 字节：上日收盘*100, 整型
 */
export default class ReaderDayFile extends ReaderBase<IDayData> {

  constructor(protected readonly filename: string) {
    super();
    this.format = "<IIIIIfII";
    this.records = this.read(filename);
  }

  protected parseRecord(item: number[]) {
    return {
      date: this.paseDate(item[0]),
      open: (item[1] / 100).toFixed(2), // 开盘价
      high: (item[2] / 100).toFixed(2), // 最高价
      low: (item[3] / 100).toFixed(2), // 最低价
      close: (item[4] / 100).toFixed(2), // 收盘价
      volume: item[5], // 成额
      amount: item[6] / 100, // 成交量 单位是手
      adjustFlag: item[7], // 复权标识
    };
  }

  private paseDate(date: number): string {
    return dayjs(date.toString(), "YYYYMMDD").format("YYYY-MM-DD");
  }
}
