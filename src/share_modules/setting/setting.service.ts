import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Setting } from './schemas/setting';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

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

  async findByKey(settingKey: string): Promise<any> {
    const find = await this.settingModel
      .findOne({
        key: settingKey,
      })
      .exec();
    return find ?? {};
  }

  async changeModeVersion(id:string, mode:string){
    await this.settingModel.updateOne({
      _id:new ObjectId(id),
    },{
      $set:{
        "data.type": mode
      }
    }).exec()
  }
}
