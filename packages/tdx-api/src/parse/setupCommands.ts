import { BaseParser } from "./base";

export class SetupCmd1 extends BaseParser {
  setup() {
    this.sendPkg = Buffer.from('0c0000000000020002001500', 'hex'); // self.sendPkg = bytearray.fromhex(u'0c 02 18 93 00 01 03 00 03 00 0d 00 01')
  }
}

export class SetupCmd2 extends BaseParser {
  setup() {
    this.sendPkg = Buffer.from('0c0218940001030003000d0001', 'hex');
  }
}

export class SetupCmd3 extends BaseParser {
  /*
  u'0c 03 18 99 00 01 20 00 20 00 db 0f d5'
  u'd0 c9 cc d6 a4 a8 af 00 00 00 8f c2 25'
  u'40 13 00 00 d5 00 c9 cc bd f0 d7 ea 00'
  u'00 00 02'
  */
  setup() {
    this.sendPkg = Buffer.from('0c031899000120002000db0fb9fabdf0d6a4c8af000000f628f440000000000000000000000000000004', 'hex');
  }
}
