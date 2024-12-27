import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingService } from './setting.service';
import { Setting, SettingSchema } from './schemas/setting';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Setting.name,
        schema: SettingSchema,
      },
    ]),
  ],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
