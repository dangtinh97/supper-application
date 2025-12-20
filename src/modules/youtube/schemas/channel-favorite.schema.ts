import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  collection: 'channel_favorites',
})
export class FavoriteChannel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  user_oid: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  channel_id: string;

  @Prop()
  browser_id: string;

  @Prop()
  thumbnail: string;
}

export const FavoriteChannelSchema =
  SchemaFactory.createForClass(FavoriteChannel);
