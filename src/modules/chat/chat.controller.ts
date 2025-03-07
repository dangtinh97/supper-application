import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

  @Post('/:id')
  async sendMessage(
    @Param('id') id: string,
    @User() { user_oid }: any,
    @Body() { message }: any,
  ) {
    return await this.chatService.sendMessage(id, user_oid, message);
  }

  @Get('/:id')
  async readMessage(@Param('id') id: string, @User() { user_oid }: any) {
    return await this.chatService.readMessage(id, user_oid);
  }
}
