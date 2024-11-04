import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { MarketDataSchedule } from 'src/schedule/marketDataSchedule';
import { TdxMarketService } from 'src/service/tdx-market.service';

@Module({
  imports: [NestScheduleModule.forRoot()],
  providers: [MarketDataSchedule, TdxMarketService],
})
export class ScheduleModule {}
