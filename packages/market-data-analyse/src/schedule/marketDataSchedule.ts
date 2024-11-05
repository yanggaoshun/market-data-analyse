import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketDataService } from 'src/service/market-data.service';
import { RedisService } from 'src/service/redis.service';
import { TdxMarketService } from 'src/service/tdx-market.service';

@Injectable()
export class MarketDataSchedule implements OnModuleInit {
  constructor(
    private readonly tdxMarketService: TdxMarketService,
    private readonly redisService: RedisService,
    private readonly marketDataService: MarketDataService,
  ) {}
  onModuleInit() {
    (async () => {
      // await this.tdxMarketService.connect();
      // this.tdxMarketService.getSecurityCount('SH');
      // const res = await this.tdxMarketService.getSecurityQuotes('SH.601727');
      // console.log(res, 'res');
      // this.redisService.set('test', 'test');
    })();
  }
  @Cron('15 9 * * *')
  private async updateMarketData(): Promise<void> {
    // TODO: update market data
    console.log('update market data');
  }
  @Cron(CronExpression.EVERY_SECOND)
  private async test() {
    if (this.tdxMarketService.connected) {
      // const res = await this.tdxMarketService.getSecurityQuotes('SH.601727');
      // res && this.marketDataService.insert(res as any);
      const res = await this.tdxMarketService.getIndexBars(
        9,
        'SH.601727',
        0,
        100,
      );
      console.log(res, 'history minute data');
    }
  }
}
