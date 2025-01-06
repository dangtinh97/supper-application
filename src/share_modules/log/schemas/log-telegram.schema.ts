import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ collection: 'log_telegram' })
export class LogTelegram {
  @Prop()
  level: string;

  @Prop()
  message: string;

  @Prop({ type: SchemaTypes.Mixed })
  data: any;
}

export const LogTelegramSchema = SchemaFactory.createForClass(LogTelegram);
