import { Body, Controller, Post } from "@nestjs/common";
import { TelegramService } from './telegram.service';
import { SendMessageDto } from "./dto/send-message.dto";

@Controller('/telegram')
export class TelegramController {
  constructor(private readonly service: TelegramService) {}
  
  @Post("/send-message")
  async sendMessage(
    @Body() req: SendMessageDto
  ){
    return await this.service.sendMessage(req);
  }
}
