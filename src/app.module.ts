import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExternalHealthModule } from './modules/external-health/external-health.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from './app.config';
import { tsMongoPlugin } from './plugins/ts-mongo.plugin';
import { TelegramModule } from "./modules/telegram/telegram.module";
import { TaskService } from "./task.service";
import { ScheduleModule } from "@nestjs/schedule";
import { YoutubeModule } from "./modules/youtube/youtube.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "./guards/auth.guard";
import { JwtStrategy } from "./jwt-strategy/jwt-strategy.service";
import { ProfileModule } from "./modules/profile/profile.module";

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TaskService,
    JwtService,
    ConfigService,
    JwtStrategy,
  ],
})
export class AppModule {}
