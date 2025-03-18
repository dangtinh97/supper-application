import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LinkStream } from './schemas/link-stream.schema';
import { Model } from 'mongoose';

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
}
