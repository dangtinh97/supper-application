import { Body, Controller, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { SendMessageDto } from './dto/send-message.dto';
import { LogService } from '../../share_modules/log/log.service';

@Controller('/telegram')
export class TelegramController {
  constructor(
    private readonly service: TelegramService,
    private readonly logService: LogService,
  ) {}

  @Post('/send-message')
  async sendMessage(@Body() req: SendMessageDto) {
    return await this.service.sendMessage(req);
  }

  @Post('/webhook')
  async webhook(@Body() req: any) {
    await this.logService.saveLogTelegram('WEBHOOK', req);
    return 'ok';
  }
}
