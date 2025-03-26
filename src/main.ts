import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { BadRequestCustomExceptionFilter } from './exceptions/bad-request-custom.exception-filter';
import * as bodyParser from 'body-parser';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { SettingService } from './share_modules/setting/setting.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('MAIN', {
    timestamp: true,
  });
  const configAppService = app.get(SettingService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new BadRequestCustomExceptionFilter());
  // app.useGlobalInterceptors(new HeaderInterceptor(configAppService));
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));
  app.enableCors();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // Thư mục chứa file HTML
  app.setViewEngine('hbs'); // Sử dụng Handlebars
  const configService = app.get(ConfigService);
  const port = configService.get<AppConfig['APP_PORT']>('APP_PORT')!;
  logger.log(`Server is running on port ${port}`);

  await app.listen(port);
}

bootstrap();
