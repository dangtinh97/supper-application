import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setting } from './schemas/setting';
import { Model } from 'mongoose';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name)
    private readonly settingModel: Model<Setting>,
  ) {}

  async getDataByKey(settingKey: string): Promise<any> {
    const find = await this.settingModel
      .findOne({
        key: settingKey,
      })
      .exec();
    return find ? find.data : null;
  }
}
