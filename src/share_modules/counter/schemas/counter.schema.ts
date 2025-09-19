import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../../../shares/schemas/base.model';

@Schema({
  collection: 'counter',
})
export class Counter extends BaseModel {
  @Prop()
  key: string;

  @Prop()
  value: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
