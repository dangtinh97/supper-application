import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Chat, StatusChat } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<Chat>,
  ) {}

  async statusOfMe(userOid: string) {
    const find = await this.chatModel.findOne({
      from_user_oid: new ObjectId(userOid),
    });
    if (!find) {
      await this.chatModel.create({
        from_user_oid: new ObjectId(userOid),
        status: StatusChat.FREE,
      });
      return {
        status: 204,
        message:
          '[Chat ẩn danh] Bạn chưa kết nối với ai, vui lòng chọn "Tìm bạn ngẫu nhiên tại" tại menu để có thể kết nối với người lạ.',
      };
    }

    if (find.status === StatusChat.FREE) {
      return {
        status: 204,
        message:
          '[Chat ẩn danh] Bạn chưa kết nối với ai, vui lòng chọn "Tìm bạn ngẫu nhiên tại" tại menu để có thể kết nối với người lạ.',
      };
    }

    if (find.status === StatusChat.WAIT) {
      return {
        status: 204,
        message:
          '[Chat ẩn danh] Bạn đang trong hàng đợi kết nối, hãy lắng nghe 1 bản nhạc trong khi chờ đợi nhé.',
      };
    }
    return {};
  }

  async findConnect(userOid) {
    const find = await this.chatModel.findOne({
      from_user_oid: new ObjectId(userOid),
    });
    if (find.status === StatusChat.CONNECTED) {
      return {
        status: 204,
        message:
          '[Chat ẩn danh] Bạn đang kết nối với 1 người lạ, nếu muốn dừng lại hãy nhấn "Ngắt kết nối" tại menu.',
      };
    }
    if (find.status === StatusChat.FREE) {
      await find.updateOne({
        status: StatusChat.WAIT,
      });
    }
    const findNotMe = await this.chatModel.aggregate([
      {
        $match: {
          status: StatusChat.WAIT,
          from_user_oid: {
            $ne: new ObjectId(userOid),
          },
        },
      },
      {
        $sample: { size: 1 },
      },
    ]);
    if (findNotMe.length == 0) {
      return {
        status: 204,
        message:
          '[Chat ẩn danh] Bạn đang trong hàng đợi kết nối, hãy lắng nghe 1 bản nhạc trong khi chờ đợi nhé.',
      };
    }

    await this.chatModel.updateOne(
      {
        from_user_oid: new ObjectId(findNotMe[1]._id),
      },
      {
        $set: {
          with_user_oid: new ObjectId(userOid),
          status: StatusChat.CONNECTED,
        },
      },
    );

    await this.chatModel.updateOne(
      {
        from_user_oid: new ObjectId(userOid),
      },
      {
        $set: {
          with_user_oid: new ObjectId(findNotMe[1]._id),
          status: StatusChat.CONNECTED,
        },
      },
    );
    if (findNotMe.length == 0) {
      return {
        status: 200,
        message:
          '[Chat ẩn danh] Chúng tôi đã kết nối bạn và 1 ai đó, hãy nói "Xin chào" để bắt đầu nhé..',
      };
    }
  }

  async disconnect(userOid) {
    const find = await this.chatModel.findOne({
      from_user_oid: new ObjectId(userOid),
    });
    let withUserOid = find.with_user_oid;
    await find.updateOne({
      status: StatusChat.FREE,
      with_user_oid: null,
    });
    if (withUserOid) {
      await this.chatModel.updateOne(
        {
          from_user_oid: withUserOid,
        },
        {
          $set: {
            status: StatusChat.FREE,
            with_user_oid: null,
          },
        },
      );
    }
    return {
      status: 204,
      message: '[Chat ẩn danh] Bạn đã ngắt kết nối.',
    };
  }
}
