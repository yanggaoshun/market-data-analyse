import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TdxMarket } from 'tdx-api';

@Injectable()
export class MarketDataSchedule {
  private readonly tdxMarket: TdxMarket;
  constructor() {
    this.tdxMarket = new TdxMarket();
    this.tdxMarket.connect();
  }
  @Cron('15 9 * * *')
  private async updateMarketData(): Promise<void> {
    // TODO: update market data
    console.log('update market data');
  }
  @Cron(CronExpression.EVERY_SECOND)
  private async test() {
    console.log('test');
    // this.tdxMarket.getSecurityQuotes(['000001']).then((data) => {
    //   console.log(data);
    // });
  }
}
