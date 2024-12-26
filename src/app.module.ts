import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExternalHealthModule } from './modules/external-health/external-health.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from './app.config';
import { tsMongoPlugin } from './plugins/ts-mongo.plugin';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<AppConfig['MONGODB_URI']>('MONGODB_URI'),
          autoCreate: true,
          autoIndex: true,
          connectionFactory: (connection: any) => {
            connection.plugin(tsMongoPlugin);
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    ExternalHealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
