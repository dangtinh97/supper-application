import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FavoriteVideo } from './schemas/favorite-video.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { WatchLaterVideo } from './schemas/watch-later-video.schema';
import { YoutubeService } from './youtube.service';

@Injectable()
export class VideoActionService {
  constructor(
    @InjectModel(FavoriteVideo.name)
    private readonly favoriteModel: Model<FavoriteVideo>,
    @InjectModel(WatchLaterVideo.name)
    private readonly watchLaterModel: Model<WatchLaterVideo>,
    private readonly youtubeService: YoutubeService,
  ) {}

  async actionFavorite(userId: string, videoId: string, action: string) {
    if (action == 'ADD') {
      return await this.favoriteModel
        .findOneAndUpdate(
          {
            user_oid: new ObjectId(userId),
            video_id: videoId,
          },
          {
            $set: {
              user_oid: new ObjectId(userId),
              video_id: videoId,
            },
          },
          {
            upsert: true,
          },
        )
        .exec();
    }

    return await this.favoriteModel
      .deleteOne({
        user_oid: new ObjectId(userId),
        video_id: videoId,
      })
      .exec();
  }

  async actionWatchLater(userId: string, videoId: string, action: string) {
    if (action == 'ADD') {
      return await this.watchLaterModel
        .findOneAndUpdate(
          {
            user_oid: new ObjectId(userId),
            video_id: videoId,
          },
          {
            $set: {
              user_oid: new ObjectId(userId),
              video_id: videoId,
            },
          },
          {
            upsert: true,
          },
        )
        .exec();
    }

    return await this.watchLaterModel
      .deleteOne({
        user_oid: new ObjectId(userId),
        video_id: videoId,
      })
      .exec();
  }

  async listFavorite(userOid: string) {
    const list = await this.favoriteModel
      .find({
        user_oid: new ObjectId(userOid),
      })
      .limit(25)
      .sort({ _id: -1 })
      .exec();

    const ids = list.map((item) => {
      return item.video_id;
    });
    return await this.youtubeService.findVideoByIds(ids);
  }

  async listWatchLater(userOid: string) {
    const list = await this.watchLaterModel
      .find({
        user_oid: new ObjectId(userOid),
      })
      .limit(25)
      .sort({ _id: -1 })
      .exec();
    const ids = list.map((item) => {
      return item.video_id;
    });
    return await this.youtubeService.findVideoByIds(ids);
  }
}
