import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';
import { Logger, ValidationPipe } from "@nestjs/common";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { BadRequestCustomExceptionFilter } from "./exceptions/bad-request-custom.exception-filter";
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('MAIN', {
    timestamp: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new BadRequestCustomExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));
  app.enableCors();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  const configService = app.get(ConfigService);
  const port = configService.get<AppConfig['APP_PORT']>('APP_PORT')!;
  logger.log(`Server is running on port ${port}`);
  await app.listen(port);
}

bootstrap();
