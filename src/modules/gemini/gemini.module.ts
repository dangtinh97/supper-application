import { Module } from '@nestjs/common';
import { SettingModule } from "../../share_modules/setting/setting.module";
import { GeminiService } from "./gemini.service";

@Module({
  imports: [
    SettingModule,
  ],
  exports: [GeminiService],
  providers: [GeminiService],
})
export class GeminiModule {}
