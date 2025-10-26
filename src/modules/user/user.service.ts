import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DrumtifyUser } from '../auth/schemas/drumtify-user';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { VideoPlaylist } from './schemas/video-playlist.schema';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(DrumtifyUser.name)
    private userModel: Model<DrumtifyUser>,
    @InjectModel(VideoPlaylist.name)
    private videoPlayListModel: Model<VideoPlaylist>,
    private youtubeService: YoutubeService,
  ) {}

  async updateSocketId(userOid: string, socketId: string) {
    await this.userModel.updateOne(
      {
        _id: new ObjectId(userOid),
      },
      {
        $set: {
          socket_id: socketId,
        },
      },
    );
    return {};
  }

  async createPlayList(userOid: string, name: string) {
    const create = await this.videoPlayListModel.create({
      name: name,
      video_ids: [],
      user_oid: new ObjectId(userOid),
    });
    return {
      id: create._id.toString(),
      name: name,
      track: 0,
    };
  }

  async addTrack(id: string, videoId: string) {
    const update = await this.videoPlayListModel.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $addToSet: {
          video_ids: videoId,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    return {
      id: update._id.toString(),
      name: update.name,
      track: update.video_ids.length,
    };
  }

  async deleteTrack(id: string, videoId: string) {
    const update = await this.videoPlayListModel.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $pull: {
          video_ids: videoId,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    console.log(update);
    return {
      id: id,
      name: update.name,
      track: update.video_ids.length,
    };
  }

  async deletePlayList(id: string) {
    await this.videoPlayListModel.deleteOne({
      _id: new ObjectId(id),
    });
    return {};
  }

  async myPlayList(userOid: string) {
    const list = await this.videoPlayListModel
      .find({
        user_oid: new ObjectId(userOid),
      })
      .sort({ updated_at: -1 });

    if (list.length == 0) {
      await this.createPlayList(userOid, 'Video xem sau');
      return await this.myPlayList(userOid);
    }

    return list.map((item) => {
      return {
        id: item._id.toString(),
        name: item.name,
        track: item.video_ids.length,
      };
    });
  }

  async videoInList(id: string) {
    const find: any = await this.videoPlayListModel.findOne({
      _id: new ObjectId(id),
    });
    return await this.youtubeService.findVideoByIds(find.video_ids || []);
  }

  async findByOid(userOid: string) {
    return await this.userModel.findOne({ _id: new ObjectId(userOid) }).exec();
  }

  async updateVipExpired(userOid: string, date: Date) {
    await this.userModel
      .findOneAndUpdate(
        {
          _id: new ObjectId(userOid),
        },
        {
          $set: {
            vip_expired: date,
          },
        },
      )
      .exec();
  }
}
