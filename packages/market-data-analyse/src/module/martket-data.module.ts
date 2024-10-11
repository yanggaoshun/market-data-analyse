import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketDataController } from 'packages/market-data-analyse/src/controller/martket-data.controller';
import { Market } from 'packages/market-data-analyse/src/entity/market.entity';
import { MarketDataService } from 'packages/market-data-analyse/src/service/martket-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  providers: [MarketDataService],
  controllers: [MarketDataController],
})
export class MarketDataModule {}
