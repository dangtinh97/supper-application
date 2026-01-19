import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../../../shares/schemas/base.model';

@Schema({
  collection: 'admins',
})
export class Admin extends BaseModel {
  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
