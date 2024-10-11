import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Market } from 'packages/market-data-analyse/src/entity/market.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class MarketDataService {
  constructor(
    @InjectRepository(Market)
    private marketDao: Repository<Market>,
  ) {}

  findAll(): Promise<Market[]> {
    return this.marketDao.find();
  }

  findOne(id: number): Promise<Market | null> {
    return this.marketDao.findOneBy({ id });
  }
  
  async insert(item: Market): Promise<InsertResult> {
    return this.marketDao.insert(item);
  }

  async remove(id: number): Promise<void> {
    await this.marketDao.delete(id);
  }
}
