import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes } from 'mongoose';
@Schema({
  collection: 'history_billing',
})
export class HistoryBilling {
  @Prop()
  order_id: string;
  @Prop({
    type: SchemaTypes.Mixed,
  })
  data: any;

  @Prop()
  use: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, unique: true })
  user_oid: mongoose.Types.ObjectId;

  @Prop()
  purchase_token: string;
}

export const HistoryBillingSchema =
  SchemaFactory.createForClass(HistoryBilling);
