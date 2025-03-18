import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LinkStream } from './schemas/link-stream.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class StreamService {
  constructor(
    @InjectModel(LinkStream.name)
    private linkStreamModel: Model<LinkStream>,
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

  async delete(userOid: string, id: string){
    await this.linkStreamModel.deleteOne({
      user_oid: new ObjectId(userOid),
      _id: new ObjectId(id)
    })
    return {}
  }

  async save(userOid: string, url: string) {
    return await this.linkStreamModel.create({
      type: 'URL_OF_USER',
      user_oid: new ObjectId(userOid),
      url: url,
      name: '',
    });
  }
}
