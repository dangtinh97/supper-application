import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum StatusChat {
  WAIT = 'WAIT',
  CONNECTED = 'CONNECTED',
  FREE = 'FREE',
}

@Schema({
  collection: 'chats',
})
export class Chat {
  @Prop({ type: mongoose.Schema.Types.ObjectId, unique: true })
  from_user_oid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  with_user_oid: mongoose.Types.ObjectId;

  @Prop()
  status: string;

  @Prop()
  room_id: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
