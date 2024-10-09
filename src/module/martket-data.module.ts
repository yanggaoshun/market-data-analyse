import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketDataController } from 'src/controller/martket-data.controller';
import { Market } from 'src/entity/market.entity';
import { MarketDataService } from 'src/service/martket-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  providers: [MarketDataService],
  controllers: [MarketDataController],
})
export class MarketDataModule {}
