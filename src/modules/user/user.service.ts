import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DrumtifyUser } from '../auth/schemas/drumtify-user';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(DrumtifyUser.name)
    private userModel: Model<DrumtifyUser>,
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
}
