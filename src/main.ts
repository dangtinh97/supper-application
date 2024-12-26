import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('MAIN', {
    timestamp: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get<AppConfig['APP_PORT']>('APP_PORT')!;
  logger.log(`Server is running on port ${port}`);
  await app.listen(port);
}

bootstrap();
