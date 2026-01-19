import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExternalHealthModule } from './modules/external-health/external-health.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from './app.config';
import { tsMongoPlugin } from './plugins/ts-mongo.plugin';
import { TelegramModule } from './modules/telegram/telegram.module';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy/jwt-strategy.service';
import { ProfileModule } from './modules/profile/profile.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ChatModule } from './modules/chat/chat.module';
import { SettingModule } from './share_modules/setting/setting.module';
import { HeaderMiddleware } from './middlewares/header.middleware';
import { GatewayModule } from './modules/gateway/gateway.module';
import { UserModule } from './modules/user/user.module';
import { StreamModule } from './modules/stream/stream.module';
import { ShareVideoModule } from './modules/share-video/share-video.module';
import { PhimModule } from './modules/phim/phim.module';
import { ShopeeModule } from './modules/shopee/shopee.module';
import { AdModule } from './modules/ad/ad.module';
import { BillingModule } from './modules/billing/billing.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ScheduleModule.forRoot(),
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET')!,
          signOptions: { expiresIn: '1y' },
        };
      },
      inject: [ConfigService],
    }),
    ExternalHealthModule,
    TelegramModule,
    YoutubeModule,
    AuthModule,
    ProfileModule,
    NotificationModule,
    ChatModule,
    SettingModule,
    GatewayModule,
    UserModule,
    StreamModule,
    ShareVideoModule,
    PhimModule,
    ShopeeModule,
    AdModule,
    BillingModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, TaskService, JwtService, ConfigService, JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeaderMiddleware).forRoutes('*');
  }
}
