import { Controller, Post } from "@nestjs/common";
import { NotificationService } from "./notification.service";

@Controller('/notifications')
export class NotificationController {
  constructor (
    private notificationService: NotificationService
  ) {
  
  }

  @Post('/send-channel')
  async sendChannel(){
    return await this.notificationService.sendNotificationWithChannel();
  }
}
