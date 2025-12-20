import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  collection: 'search_keywords',
})
export class SearchKeyword {
  @Prop()
  keyword: string;

  @Prop()
  count: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  user_oid: mongoose.Types.ObjectId;
}

export const SearchKeywordSchema = SchemaFactory.createForClass(SearchKeyword);
