import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Admin } from './schemas/admin.schema';
import { UserService } from '../user/user.service';
import { SettingService } from '../../share_modules/setting/setting.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
    private jwtService: JwtService,
    private userService: UserService,
    private settingService: SettingService,
  ) {}

  async attempt({ username, password }: any) {
    const find = await this.adminModel.findOne({
      username: username,
    });
    if (!find) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, find.password);
    if (!isMatch) {
      return null;
    }
    const token = this.jwtService.sign({
      sub: find._id.toString(),
    });
    return {
      username: username,
      token: token,
    };
  }

  async dashboard() {
    const totalUser = await this.userService.analysis();
    return {
      ...totalUser,
    };
  }

  async infoSetting() {
    const findVersion = await this.settingService.findByKey(
      'app_version_org.youpip.app',
    );

    const findMusicVersion = await this.settingService.findByKey(
      'app_version_com.myoupip.appoffline',
    );

    return {
      APP_VERSION: findVersion,
      APP_MUSIC_VERSION: findMusicVersion,
    };
  }

  async updateTypeVersionApp(id: string, type: string) {
    return await this.settingService.changeModeVersion(id, type);
  }
}
