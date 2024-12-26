import { Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class BaseModel extends Document {
  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}
