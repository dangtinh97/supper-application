import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseModel } from '../../../shares/schemas/base.model';

@Schema({
  collection: 'ytb_favorite_videos',
})
export class FavoriteVideo extends BaseModel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  user_oid: mongoose.Types.ObjectId;

  @Prop()
  video_id: string;
}

export const FavoriteVideoSchema = SchemaFactory.createForClass(FavoriteVideo);
