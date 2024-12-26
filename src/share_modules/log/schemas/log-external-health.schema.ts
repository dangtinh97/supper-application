import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'log_external_health' })
export class LogExternalHealth {}

export const LogExternalHealthSchema =
  SchemaFactory.createForClass(LogExternalHealth);
