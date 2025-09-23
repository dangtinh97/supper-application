import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LinkStream } from './schemas/link-stream.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Suggest } from './schemas/suggest.schema';
import * as _ from 'lodash';

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
      .sort({ sort: -1 });
    const result = [];
    findAll.forEach((item) => {
      if (item.parent_id == null || item.parent_id === 0) {
        const filterItems = findAll.filter((itemSuggest) => {
          return itemSuggest.parent_id === item.id;
        });
        result.push({
          name: item.name,
          items: filterItems.map((res) => {
            return {
              name: res.name,
              image: res.image,
              content: res.content,
              type: res.type,
            };
          }),
        });
      }
    });

    return result;
  }

  async crawlFilmDailyMotion() {
    const find = await this.suggestModel.find({
      source: { $regex: 'dailymotion', $options: 'i' },
    });
    let update = 0;
    for (const findKey in find) {
      const item = find[findKey];
      if (item.content.indexOf('https://') != 0) {
        continue;
      }
      const curl = await fetch(item.content);
      const status = curl.status;
      if (status == 200) {
        continue;
      }
      await this.suggestModel.findOneAndUpdate(
        {
          _id: item._id,
        },
        {
          $set: {
            status: 'NO_ACTIVE',
          },
        },
      );
      const linkNew = await this.getLinkStreamNew(item.source);
      if (linkNew == null) {
        continue;
      }
      update++;
      await this.suggestModel.findOneAndUpdate(
        {
          _id: item._id,
        },
        {
          $set: {
            content: linkNew,
            status: 'ACTIVE',
          },
        },
      );
    }

    return { update };
  }

  async getLinkStreamNew(url: string) {
    try {
      const curl = await fetch(
        'https://www.genviral.io/api/tools/social-downloader',
        {
          method: 'POST',
          body: JSON.stringify({
            url: url,
          }),
        },
      );

      const json = await curl.json();

      return _.get(json, 'medias.0.url', null);
    } catch (e) {
      return null;
    }
  }
}
