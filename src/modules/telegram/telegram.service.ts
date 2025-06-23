import { Injectable } from '@nestjs/common';
import { SettingService } from '../../share_modules/setting/setting.service';
import { SendMessageDto } from './dto/send-message.dto';
import { SETTING_KEY } from '../../share_modules/setting/schemas/setting';

@Injectable()
export class TelegramService {
  constructor(private readonly settingService: SettingService) {}

  async sendMessage(
    body: SendMessageDto,
    bot: SETTING_KEY = SETTING_KEY.BOT_TOKEN_SUPPER_APPLICATION,
  ): Promise<any> {
    const token = await this.settingService.getDataByKey(bot);
    const curl = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
    const json = await curl.json();
    return json;
  }

  async responseGpt() {
    return await this.settingService.getDataByKey('RESPONSE_GPT');
  }
}
