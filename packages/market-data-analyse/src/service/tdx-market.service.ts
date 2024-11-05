import { Injectable } from '@nestjs/common';
import { TdxMarket } from 'tdx-api';

@Injectable()
export class TdxMarketService extends TdxMarket {
  constructor() {
    super();
    this.connect();
  }
}
