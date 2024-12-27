import { Module } from '@nestjs/common';
import { ExternalHealthService } from './external-health.service';
import { ExternalHealthController } from './external-health.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExternalHealthConfig,
  ExternalHealthConfigSchema,
} from './schemas/external-health-config.schema';
import { TelegramModule } from '../telegram/telegram.module';
import { SettingModule } from '../../share_modules/setting/setting.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExternalHealthConfig.name,
        schema: ExternalHealthConfigSchema,
      },
    ]),
    TelegramModule,
    SettingModule,
  ],
  providers: [ExternalHealthService],
  controllers: [ExternalHealthController],
  exports: [ExternalHealthService],
})
export class ExternalHealthModule {}
