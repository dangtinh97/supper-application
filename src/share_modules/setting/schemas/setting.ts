import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
export enum SETTING_KEY {
  APP_NAME = 'app_name',
  BOT_TOKEN_SUPPER_APPLICATION = 'BOT_TOKEN_SUPPER_APPLICATION',
  CHAT_ID_SUPPER_APPLICATION = 'CHAT_ID_SUPPER_APPLICATION',
}
@Schema({
  collection: 'setting',
})
export class Setting {
  @Prop()
  key: string;

  @Prop({ type: SchemaTypes.Mixed })
  data: any;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
