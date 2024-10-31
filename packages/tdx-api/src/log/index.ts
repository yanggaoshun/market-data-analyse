import { createLogger, format, transports } from 'winston';


class Logger {
  private logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
    transports: [
      new transports.Console(),
      // 你可以添加更多的传输方式，比如文件，HTTP等
    ],
  })
  setLevel(level: string) {
    this.logger.level = level;
  }
  setLogger(logger: any) {
    this.logger = logger;
  }
  getLogger() {
    return this.logger;
  }
}
const l = new Logger();

const logger = l.getLogger();
const setLogger = l.setLogger;
const setLevel = l.setLevel;

export { logger, setLogger, setLevel };
