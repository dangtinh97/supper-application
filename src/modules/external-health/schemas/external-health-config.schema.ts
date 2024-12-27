import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({
  collection: 'external_health_config',
})
export class ExternalHealthConfig {
  @Prop()
  url: string;
  @Prop()
  method: string;
  @Prop()
  status_allow: number[];

  @Prop({ type: SchemaTypes.Mixed })
  headers: any;

  @Prop()
  is_active: boolean;
}

export const ExternalHealthConfigSchema =
  SchemaFactory.createForClass(ExternalHealthConfig);
