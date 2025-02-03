import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseModel } from '../../../shares/schemas/base.model';

@Schema({
  collection: 'recently_videos',
})
export class RecentlyVideo extends BaseModel {
  @Prop()
  video_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  user_oid: mongoose.Types.ObjectId;

  @Prop()
  count: number;
}

export const RecentlyVideoSchema = SchemaFactory.createForClass(RecentlyVideo);
