import { Body, Controller, Get, Post } from '@nestjs/common';
import { Market } from 'src/entity/market.entity';
import { MarketDataService } from 'src/service/martket-data.service';

@Controller('/market')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('/find-all')
  getFindAll(): Promise<Market[]> {
    return this.marketDataService.findAll();
  }

  @Post('/insert')
  insertOne(@Body() item: Market) {
    return this.marketDataService.insert(item);
  }
}
