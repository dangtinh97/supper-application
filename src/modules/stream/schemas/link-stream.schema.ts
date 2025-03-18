import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';

@Schema({
  collection: 'link_streams',
})
export class LinkStream {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  user_oid: mongoose.Types.ObjectId;

  @Prop()
  link: string;

  @Prop()
  name: string;

  @Prop()
  type: string;
}

export const LinkStreamSchema = SchemaFactory.createForClass(LinkStream);
