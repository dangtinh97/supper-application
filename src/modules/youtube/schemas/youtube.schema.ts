import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { BaseModel } from '../../../shares/schemas/base.model';
import { SchemaTypes, Types } from 'mongoose';

@Schema({
  collection: 'ytb_video',
})
export class Youtube extends BaseModel {
  @Prop()
  title: string;

  @Prop()
  video_id: string;

  @Prop()
  thumbnails: Array<any>;

  @Prop()
  duration: number;
  @Prop()
  view_of_ytb: number;

  @Prop({ default: 0 })
  view_of_app: number;

  @Prop()
  description: string;

  @Prop({ type: SchemaTypes.Mixed })
  channel: any;
  @Prop()
  language_title: string;

  @Prop({ default: true })
  is_vie: boolean;
}

export const YoutubeSchema = SchemaFactory.createForClass(Youtube);
