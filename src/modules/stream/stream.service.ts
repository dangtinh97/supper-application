import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LinkStream } from './schemas/link-stream.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Suggest } from './schemas/suggest.schema';

@Injectable()
export class StreamService {
  constructor(
    @InjectModel(LinkStream.name)
    private linkStreamModel: Model<LinkStream>,
    @InjectModel(Suggest.name)
    private suggestModel: Model<Suggest>,
  ) {}

  async getVieOn(cond: any) {
    const list = await this.linkStreamModel.find(cond);
    return list.map((item: any) => {
      return {
        id: item._id.toString(),
        type: item.type,
        name: item.name,
        url: item.url,
      };
    });
  }

  async delete(userOid: string, id: string) {
    await this.linkStreamModel.deleteOne({
      user_oid: new ObjectId(userOid),
      _id: new ObjectId(id),
    });
    return {};
  }

  async save(userOid: string, url: string) {
    return await this.linkStreamModel.create({
      type: 'URL_OF_USER',
      user_oid: new ObjectId(userOid),
      url: url,
      name: '',
    });
  }

  async getSuggest() {
    const findAll = await this.suggestModel
      .find({
        status: 'ACTIVE',
      })
      .sort({ id: -1 });
    console.log(findAll);
    let result = {};

    findAll.forEach((item) => {
      if (item.parent_id == null || item.parent_id === 0) {
        result[item.id] = {
          name: item.name,
          items:[],
        };
      }
    });

    return result;
  }
}
