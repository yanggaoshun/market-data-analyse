import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketDataController } from 'src/controller/market-data.controller';
import { Market } from 'src/entity/market.entity';
import { MarketDataService } from 'src/service/market-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  providers: [MarketDataService],
  controllers: [MarketDataController],
  exports: [MarketDataService],
})
export class MarketDataModule {}
