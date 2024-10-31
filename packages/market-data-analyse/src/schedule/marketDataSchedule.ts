import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MarketDataSchedule {
  @Cron('15 9 * * *')
  private async updateMarketData(): Promise<void> {
    // TODO: update market data
    console.log('update market data');
  }
  @Cron(CronExpression.EVERY_SECOND)
  private test(): void {
    console.log('test');
  }
}
