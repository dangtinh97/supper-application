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
    return {
      status: 200,
      message:
        '[Chat ẩn danh] Bạn đang trong hàng đợi kết nối, hãy lắng nghe 1 bản nhạc trong khi chờ đợi nhé.',
      room_id: find.room_id,
    };
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
    const roomId = this.generateUUID();
    await this.chatModel.updateOne(
      {
        from_user_oid: findNotMe[0]._id,
      },
      {
        $set: {
          with_user_oid: new ObjectId(userOid),
          status: StatusChat.CONNECTED,
          room_id: roomId,
        },
      },
    );

    await this.chatModel.updateOne(
      {
        from_user_oid: new ObjectId(userOid),
      },
      {
        $set: {
          with_user_oid: findNotMe[0]._id,
          status: StatusChat.CONNECTED,
          room_id: roomId,
        },
      },
    );
    return {
      status: 200,
      message:
        '[Chat ẩn danh] Chúng tôi đã kết nối bạn và 1 ai đó, hãy nói "Xin chào" để bắt đầu nhé..',
      room_id: roomId,
    };
  }

  async disconnect(userOid) {
    const find = await this.chatModel.findOne({
      from_user_oid: new ObjectId(userOid),
    });
    const withUserOid = find.with_user_oid;
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

  generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
  }
}
