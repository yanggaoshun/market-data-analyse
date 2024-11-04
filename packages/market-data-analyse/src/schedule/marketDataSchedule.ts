import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TdxMarketService } from 'src/service/tdx-market.service';

@Injectable()
export class MarketDataSchedule implements OnModuleInit {
  constructor(private readonly tdxMarketService: TdxMarketService) {}
  onModuleInit() {
    (async () => {
      await this.tdxMarketService.connect();
      this.tdxMarketService.getSecurityCount('SH');
      const res = await this.tdxMarketService.getSecurityQuotes('SH.601727');
      console.log(res, 'res');
    })();
  }
  @Cron('15 9 * * *')
  private async updateMarketData(): Promise<void> {
    // TODO: update market data
    console.log('update market data');
  }
  @Cron(CronExpression.EVERY_SECOND)
  private async test() {
    console.log('test');
    // await this.tdxMarketService.connect();
    // this.tdxMarketService.getSecurityCount('SH');
  }
}
