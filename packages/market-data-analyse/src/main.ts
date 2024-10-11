import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { TdxMarketApi } from 'nodetdx';
import { MarketDataService } from './service/martket-data.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const api = new TdxMarketApi({
    heartbeatInterval: 30000,
    idleTimeout: 60000,
  });
  const marketDataService = app.get(MarketDataService);
  await api.connect();
  api.subscribeQuotes('SH.000001', 'SZ.002603', (data) => {
    data.forEach((item) => {
      marketDataService.insert(item);
    });
  });

  await app.listen(3000);
}
bootstrap();
