import { Controller, Module, Post, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';

@Controller('/billings')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post('/verify-purchase')
  async verifyPurchase(@User() { user_oid }: any, @Req() { body }: any) {
    return await this.billingService.verifyPurchase(user_oid, body);
  }
}
