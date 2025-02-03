import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../../../shares/schemas/base.model';

@Schema({
  collection: 'drumtify_users',
})
export class DrumtifyUser extends BaseModel {
  @Prop()
  uid_device: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  token_fcm: string;
  
  @Prop()
  login_last: Date;
  
  @Prop()
  full_name: string;
}

export const DrumtifyUserSchema = SchemaFactory.createForClass(DrumtifyUser);
