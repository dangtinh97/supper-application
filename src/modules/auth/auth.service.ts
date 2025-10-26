import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DrumtifyUser } from './schemas/drumtify-user';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { SettingService } from '../../share_modules/setting/setting.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(DrumtifyUser.name)
    private readonly drumtifyUserModel: Model<DrumtifyUser>,
    private jwtService: JwtService,
    private settingService: SettingService,
  ) {}

  async login(uidDevice: string, appVersion: string, lang: string = 'vi') {
    const update = await this.drumtifyUserModel.findOneAndUpdate(
      {
        uid_device: uidDevice,
      },
      {
        login_last: new Date(),
        app_version: appVersion,
        language: lang,
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    );
    const accessToken = this.jwtService.sign({
      sub: update._id.toString(),
    });
    const findConfigAd =
      (await this.settingService.getDataByKey('CONFIG_AD')) ?? -1;
    let loadAd = false;

    if (!update.time_load_ad || update.time_load_ad <= new Date()) {
      await this.drumtifyUserModel.updateOne(
        {
          _id: update._id,
        },
        {
          $set: {
            time_load_ad: dayjs().add(findConfigAd, 'minutes'),
          },
        },
      );
    }

    if (update.time_load_ad && update.time_load_ad <= new Date()) {
      loadAd = true;
    }
    if (
      findConfigAd < 0 ||
      update.created_at > dayjs().subtract(1, 'day').toDate()
    ) {
      loadAd = false;
    }
    return {
      user_oid: update._id.toString(),
      email: update.email || '',
      name: update.full_name || '',
      token: accessToken,
      vip_expire: dayjs(update.vip_expired ?? new Date()).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      load_ad: loadAd,
    };
  }
}
