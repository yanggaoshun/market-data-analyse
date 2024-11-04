// 获取股票数量 深市
// 参数：市场代码， 股票代码， 如： 0 或 1

import { EMarketType } from "../types/enum";
import { BaseParser } from "./base";
import bufferpack from 'bufferpack';

// 发送
// 0c 0c 18 6c 00 01 08 00 08 00 4e 04 00 00 75 c7 33 01


// 接收
// Bc cb 74 00 0c 0c 18 6c 00 00 4e 04 02 00 02 00 e7 19

// In [61]: 0x19e7
// Out[61]: 6631


// 沪市

// 发送
// 0c 0c 18 6c 00 01 08 00 08 00 4e 04 01 00 75 c7 33 01

// 接收
// Bc cb 74 00 0c 0c 18 6c 00 00 4e 04 02 00 02 00 b3 33

// In [63]: 0x333b
// Out[63]: 13115
// 获取市场股票数量

export class GetSecurityCount extends BaseParser {
  setParams(market: EMarketType) {
    const pkg = Buffer.from('0c0c186c0001080008004e04', 'hex'); // pkg = bytearray.fromhex(u"0c 0c 18 6c 00 01 08 00 08 00 4e 04")
    const pkgParam = bufferpack.pack('<H', market.toString());
    const pkgTail = Buffer.from('75c73301', 'hex');
    this.sendPkg = Buffer.concat([pkg, pkgParam, pkgTail]);
  }

  parseResponse(bodyBuf: Buffer) {
    const [num] = bufferpack.unpack('<H', bodyBuf.slice(0, 2));
    return num;
  }

  setup() {}
}

