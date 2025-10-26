import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HistoryBilling,
  HistoryBillingSchema,
} from './schemas/history-billing.schema';
import { UserModule } from '../user/user.module';
import { SettingModule } from '../../share_modules/setting/setting.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HistoryBilling.name,
        schema: HistoryBillingSchema,
      },
    ]),
    UserModule,
    SettingModule,
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [],
})
export class BillingModule {}
