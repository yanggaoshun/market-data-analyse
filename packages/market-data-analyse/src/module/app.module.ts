import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'packages/market-data-analyse/src/controller/app.controller';
import { AppService } from 'packages/market-data-analyse/src/service/app.service';
import { MarketDataModule } from './martket-data.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'test',
      synchronize: true, // 同步表结构
      autoLoadEntities: true,
    }),
    MarketDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
