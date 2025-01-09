import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DrumtifyUser } from './schemas/drumtify-user';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(DrumtifyUser.name)
    private readonly drumtifyUserModel: Model<DrumtifyUser>,
    private jwtService: JwtService,
  ) {}

  async login(uidDevice: string, token: string) {
    const update = await this.drumtifyUserModel.findOneAndUpdate(
      {
        uid_device: uidDevice,
      },
      {
        login_last: new Date(),
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    );
    const accessToken = this.jwtService.sign({
      sub: update._id.toString(),
    });
    return {
      user_oid: update._id.toString(),
      email: update.email || '',
      name: update.full_name || '',
      token: accessToken,
      vip_expire: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
  }
}
