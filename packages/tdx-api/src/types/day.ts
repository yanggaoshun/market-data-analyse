export interface IDayData {
  date: string;
  open: string; // 开盘价
  high: string; // 最高价
  low: string; // 最低价
  close: string; // 收盘价
  volume: number; // 成额
  amount: number; // 成交量 单位是手
  adjustFlag: number; // 复权标识
}
