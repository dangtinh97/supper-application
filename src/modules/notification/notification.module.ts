import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { SettingModule } from '../../share_modules/setting/setting.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [SettingModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
