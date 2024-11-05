import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { setLogger } from 'tdx-api';
import { CustomLogger } from './service/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setLogger(new CustomLogger('TdxMarketService'));
  await app.listen(3000);
}
bootstrap();
