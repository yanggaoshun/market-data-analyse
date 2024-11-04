import { Injectable } from '@nestjs/common';
import { TdxMarket } from 'tdx-api';
import { CustomLogger } from './logger.service';

@Injectable()
export class TdxMarketService extends TdxMarket {
  constructor() {
    super(new CustomLogger('TdxMarketService'));
  }
}
