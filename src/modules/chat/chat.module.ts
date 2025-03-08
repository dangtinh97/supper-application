import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { GatewayModule } from "../gateway/gateway.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    GatewayModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
