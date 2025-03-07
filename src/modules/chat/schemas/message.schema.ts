import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  collection: 'messages',
})
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, unique: true })
  from_user_oid: mongoose.Types.ObjectId;
  @Prop()
  room_id: string;

  @Prop()
  message: string;

  @Prop()
  read: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
