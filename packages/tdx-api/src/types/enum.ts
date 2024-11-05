export enum EMarketType {
  SH = 1,
  SZ = 0,
  DCE = 29,
  CZCE = 28,
  SHFE = 30,
  CFFEX = 47,
  "O@CZCE" = 4, // 郑州商品期权
  "O@DCE" = 5,
  "O@SHFE" = 6,
  "O@CFFEX" = 7,
  "O@SH" = 8,
  "O@SZ" = 9,
  MFC = 60, // 主力期货合约, main future contract
}
// 0 5分钟K, 1 15分钟K, 2 30分钟K, 3 1小时K, 4 日K, 5 周K, 6 月K, 7 1分钟K, 8 1分钟K, 9 日K, 10 季K, 11 年K
export enum EPeriodType {
  "1m" = 8,
  "1m_" = 7,
  "5m" = 0,
  "15m" = 1,
  "30m" = 2,
  "H" = 3,
  "D" = 9,
  "W" = 5,
  "M" = 6,
  "D_" = 4,
  "Q" = 10,
  "Y" = 11,
}
