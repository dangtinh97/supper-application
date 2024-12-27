import { Module } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { SettingModule } from "../../share_modules/setting/setting.module";
import { TelegramController } from "./telegram.controller";
import { LogModule } from "../../share_modules/log/log.module";

@Module({
  imports:[
    SettingModule,
    LogModule,
  ],
  providers: [TelegramService],
  controllers: [TelegramController],
  exports: [TelegramService],
})
export class TelegramModule {}
