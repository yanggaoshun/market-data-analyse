import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { MarketDataSchedule } from 'src/schedule/marketDataSchedule';
import { RedisService } from 'src/service/redis.service';
import { TdxMarketService } from 'src/service/tdx-market.service';
import { MarketDataModule } from './market-data.module';

@Module({
  imports: [NestScheduleModule.forRoot(), MarketDataModule],
  providers: [MarketDataSchedule, TdxMarketService, RedisService],
})
export class ScheduleModule {}
