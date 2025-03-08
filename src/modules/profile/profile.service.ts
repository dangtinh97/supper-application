import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DrumtifyUser } from '../auth/schemas/drumtify-user';
import { Model } from 'mongoose';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(DrumtifyUser.name)
    private readonly userModel: Model<DrumtifyUser>,
  ) {}

  async updateTokenFcm(uidDevice: string, tokenFcm: string) {
    await this.userModel.findOneAndUpdate(
      {
        uid_device: uidDevice,
      },
      {
        $set: {
          token_fcm: tokenFcm,
        },
      },
    );
    return {
      uid_device: uidDevice,
    };
  }
}
