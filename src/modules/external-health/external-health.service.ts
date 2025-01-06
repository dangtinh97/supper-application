import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ExternalHealthConfig } from './schemas/external-health-config.schema';
import { Model } from 'mongoose';
import { TelegramService } from '../telegram/telegram.service';
import { SettingService } from '../../share_modules/setting/setting.service';
import { SETTING_KEY } from '../../share_modules/setting/schemas/setting';

@Injectable()
export class ExternalHealthService {
  constructor(
    @InjectModel(ExternalHealthConfig.name)
    private readonly externalHealthConfigModel: Model<ExternalHealthConfig>,
    private readonly telegramService: TelegramService,
    private readonly settingService: SettingService,
  ) {}

  async checkHealth(config: ExternalHealthConfig): Promise<boolean> {
    try {
      const curl = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
      });
      return curl.ok || config.status_allow.indexOf(curl.status) !== -1;
    } catch (e) {
      return false;
    }
  }

  async checkHealthAll(): Promise<any> {
    const allConfigs = await this.findAll();
    return await Promise.all(
      allConfigs.map(async (config) => {
        return this.checkHealth(config).then(async (res) => {
          if (!res) {
            const chatId = await this.settingService.getDataByKey(
              SETTING_KEY.CHAT_ID_SUPPER_APPLICATION,
            );
            await this.telegramService.sendMessage(
              {
                chat_id: chatId,
                text: `Health check failed for:\n${config.url}`,
                parse_mode: 'text',
              },
              SETTING_KEY.BOT_TOKEN_SUPPER_APPLICATION,
            );
          }
          return {
            url: config.url,
            ok: res,
          };
        });
      }),
    );
  }

  async findAll(): Promise<ExternalHealthConfig[]> {
    return await this.externalHealthConfigModel
      .find({
        is_active: true,
      })
      .exec();
  }
}
