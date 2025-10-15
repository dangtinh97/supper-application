import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SettingService } from '../../share_modules/setting/setting.service';

@Injectable()
export class AdService {
  constructor(
    private userService: UserService,
    private configService: SettingService,
  ) {}

  async getLoadAd(userOid: string) {
    const [user, config] = await Promise.all([
      this.userService.findByOid(userOid),
      this.configService.getDataByKey('AD_REWARD'),
    ]);
    const adFreeTimeRegisterMs = config.ads_free_time_register * 60 * 1000;
    return {
      ...config,
      ads_enabled:
        config.ads_enabled &&
        new Date().getTime() - user.created_at.getTime() >=
          adFreeTimeRegisterMs,
    };
  }
}
