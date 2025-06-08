import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'shopee_affiliates',
})
export class Affiliate {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  url: string;

  @Prop({ default: 1000 })
  price: number;

  @Prop({default: true})
  show: boolean;

  @Prop()
  order: number;
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate);
