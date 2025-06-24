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
    const data = await this.service.responseGpt();
    return {
      status: 0,
      data: data,
    };
  }
}
