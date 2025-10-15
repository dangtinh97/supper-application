import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AdService } from './ad.service';
import { User } from '../../decorators/user.decorator';

@Controller('/ad')
@UseGuards(JwtAuthGuard)
export class AdController {
  constructor(
    private adService:AdService
  ) {}
  @Get('/config')
  async config(
    @User() { user_oid }: any,
  ) {
    return await this.adService.getLoadAd(user_oid);
  }
}
