import { Body, Controller, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { SendMessageDto } from './dto/send-message.dto';
import { LogService } from '../../share_modules/log/log.service';
import { SpendingService } from './spending.service';

const _ = require('lodash');

@Controller('/telegram')
export class TelegramController {
  constructor(
    private readonly service: TelegramService,
    private readonly logService: LogService,
    private readonly spendingService: SpendingService,
  ) {}

  @Post('/send-message')
  async sendMessage(@Body() req: SendMessageDto) {
    return await this.service.sendMessage(req);
  }

  @Post('/webhook')
  async webhook(@Body() req: any) {
    await this.logService.saveLogTelegram('WEBHOOK', req);
    return {
      id: 'resp_67cb61fa3a448190bcf2c42d96f0d1a8',
      object: 'response',
      created: 1678901234,
      model: 'gpt-4o',
      output_text:
        'Why did the scarecrow win an award? Because he was outstanding in his field!',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content:
              'Why did the scarecrow win an award? Because he was outstanding in his field!',
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 15,
        total_tokens: 25,
      },
    };
  }
}
