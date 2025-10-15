import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AdController } from './ad.controller';
import { AdService } from './ad.service';
import { SettingModule } from '../../share_modules/setting/setting.module';

@Module({
  imports: [UserModule, SettingModule],
  providers: [AdService],
  controllers: [AdController],
})
export class AdModule {}
