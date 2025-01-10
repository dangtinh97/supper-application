import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '../../decorators/user.decorator';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ProfileService } from './profile.service';

@Controller('/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Post('/token-fcm')
  async updateTokenFcm(@Body() body: any, @User() user: any, @Req() req: any) {
    const token = body.token;
    const user_oid = user.user_oid;
    const uid_device = req.headers['uid-device'];
    return await this.service.updateTokenFcm(uid_device, token);
  }
}
