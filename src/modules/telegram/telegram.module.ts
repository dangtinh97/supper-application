import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { SettingModule } from '../../share_modules/setting/setting.module';
import { TelegramController } from './telegram.controller';
import { LogModule } from '../../share_modules/log/log.module';
import { SpendingService } from './spending.service';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [SettingModule, LogModule, GeminiModule],
  providers: [TelegramService, SpendingService],
  controllers: [TelegramController],
  exports: [TelegramService],
})
export class TelegramModule {}
