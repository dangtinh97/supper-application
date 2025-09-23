import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum ESuggestType {
  VIEON = 'VIEON',
  CONTENT_AUDIO = 'CONTENT_AUDIO',
  LINK_PLAY = 'LINK_PLAY',
  CONTENT = 'CONTENT',
  IMAGE = 'IMAGE',
}

@Schema({
  collection: 'suggests',
})
export class Suggest {
  @Prop()
  id: number;

  @Prop()
  parent_id: number;

  @Prop()
  name: string;

  @Prop()
  content: string;

  @Prop()
  image: string;

  @Prop()
  type: string;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop()
  source: string;

  @Prop()
  sort: number;
}

export const SuggestSchema = SchemaFactory.createForClass(Suggest);
