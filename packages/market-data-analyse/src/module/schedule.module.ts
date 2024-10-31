import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { MarketDataSchedule } from 'src/schedule/marketDataSchedule';

@Module({
  imports: [NestScheduleModule.forRoot()],
  providers: [MarketDataSchedule],
})
export class ScheduleModule {}
