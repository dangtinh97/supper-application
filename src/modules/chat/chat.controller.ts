import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { User } from '../../decorators/user.decorator';
import { JwtAuthGuard } from '../../guards/auth.guard';

@Controller('/chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/status')
  async statusChat(@User() { user_oid }: any) {
    return await this.chatService.statusOfMe(user_oid);
  }

  @Post('/status')
  async actionStatus(@User() { user_oid }: any, @Body() { status }: any) {
    if (status === 'CONNECT') {
      return await this.chatService.findConnect(user_oid);
    }
    return await this.chatService.disconnect(user_oid);
  }
}
