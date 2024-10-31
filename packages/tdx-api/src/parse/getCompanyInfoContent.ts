// 读取公司信息详情
// 参数：市场代码， 股票代码, 文件名, 起始位置， 数量, 如：0,000001,000001.txt,2054363,9221

import { BaseParser } from "./base";
import bufferpack from "bufferpack";

export class GetCompanyInfoContent extends BaseParser {
  setParams(
    market: number,
    code: string,
    filename: string,
    start: number,
    length: number,
  ) {
    if (filename.length !== 80) {
      filename = filename.padEnd(78, "\x00") + "\x30\x30"; // filename = filename.ljust(78, b'\x00')+b'\x30\x30'
    }

    const pkg = Buffer.from("0c03109c000168006800d002", "hex");
    const pkgParam = bufferpack.pack("<H6sH80sIII", [
      market,
      code,
      0,
      filename,
      start,
      length,
      0,
    ]);
    this.sendPkg = Buffer.concat([pkg, pkgParam]);
  }

  parseResponse(bodyBuf: Buffer) {
    let pos = 0;
    const [, length] = bufferpack.unpack("<10sH", bodyBuf.subarray(0, 12)) as [
      string,
      number,
    ]; // _, length = struct.unpack(u'<10sH', bodyBuf[:12])
    pos += 12;
    const content = bodyBuf.subarray(pos, pos + length);
    return this.decode(content, "gbk"); // content.decode('GBK', 'ignore')
  }

  setup() {}
}
