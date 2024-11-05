import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis {
  constructor() {
    super({
      port: 6379,
      host: '127.0.0.1',
    });
  }
}
