import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
  info(message: string) {
    super.log(message);
  }
}
