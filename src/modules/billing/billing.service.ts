import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { AppConfig } from '../../app.config';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { HistoryBilling } from './schemas/history-billing.schema';
import { Model } from 'mongoose';
import { SettingService } from '../../share_modules/setting/setting.service';
import { SETTING_KEY } from '../../share_modules/setting/schemas/setting';
import * as dayjs from 'dayjs';
import { UserService } from '../user/user.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class BillingService {
  constructor(
    private configService: ConfigService,
    @InjectModel(HistoryBilling.name)
    private readonly historyBillingModel: Model<HistoryBilling>,
    private readonly settingService: SettingService,
    private readonly userService: UserService,
  ) {}

  async verifyPurchase(userOid: string, { purchase_token, product_id }) {
    const key = await this.settingService.getDataByKey(SETTING_KEY.IAP_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });
    const androidPublisher = google.androidpublisher({
      version: 'v3',
      auth,
    });
    try {
      let res: any = {};
      if (product_id.indexOf('sub') !== -1) {
        res = await androidPublisher.purchases.subscriptions.get({
          packageName: 'org.youpip.app',
          subscriptionId: product_id,
          token: purchase_token,
        });
      } else {
        res = await androidPublisher.purchases.products.get({
          packageName: 'org.youpip.app',
          productId: product_id,
          token: purchase_token,
        });
      }
      await this.historyBillingModel.create({
        user_oid: new ObjectId(userOid),
        order_id: res.data.orderId,
        data: res.data,
        purchase_token: purchase_token,
      });
      if (res.data.acknowledgementState === 1) {
        let date = new Date();
        if (res.data.kind === 'androidpublisher#subscriptionPurchase') {
          date = new Date(Number(res.data.expiryTimeMillis));
        } else {
          date = dayjs().add(1000, 'years').toDate();
        }
        await this.userService.updateVipExpired(userOid, date);
        return { valid: true };
      } else {
        return { valid: false };
      }
    } catch (err) {
      console.error('❌ Verify failed:', err);
      return { valid: false, error: err };
    }
  }
}
