import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  collection: 'search_keywords',
})
export class SearchKeyword {
  @Prop()
  keyword: string;

  @Prop()
  count: number;
}

export const SearchKeywordSchema = SchemaFactory.createForClass(SearchKeyword);
