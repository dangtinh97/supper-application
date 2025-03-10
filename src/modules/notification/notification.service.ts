import { Injectable } from '@nestjs/common';
import { SettingService } from '../../share_modules/setting/setting.service';
import { GoogleAuth } from 'google-auth-library';

@Injectable()
export class NotificationService {
  private URL_FCM =
    'https://fcm.googleapis.com/v1/projects/__PROJECT_ID__/messages:send';
  private data: object;
  private title: string;
  private body: string;
  private keyAuth: string;
  private projectId: string;

  constructor(private readonly settingService: SettingService) {}

  private async sendNotificationWithToken(
    token: string,
    title: string,
    body: string,
    data: Record<string, any>,
  ) {
    this.title = title;
    this.body = body;
    this.data = data;
    this.keyAuth = await this.getToken();
    const bodySend = {
      token: token,
      data: this.data,
    };
    const bodyUpgrade = {
      message: bodySend,
    };
    const jsonString = JSON.stringify(bodyUpgrade);

    return this.sendFCMWithData(jsonString);
  }

  async sendFCMWithData(data: string): Promise<any> {
    const log: Record<string, any> = { data };
    try {
      const url = this.URL_FCM.replace('__PROJECT_ID__', this.projectId);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: this.keyAuth,
      };

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          ...headers,
        },
      });
      console.log(response);
    } catch (error) {
      console.error('Error sending FCM:', error);
      log.error = error.stack;
      throw new Error();
    }

    return log;
  }

  private async getToken() {
    const serviceAccount = await this.settingService.getDataByKey(
      'FIREBASE_SERVICE_ACCOUNT',
    );
    try {
      const auth = new GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
      });
      this.projectId = serviceAccount.project_id;
      const client = await auth.getClient();
      const tokenResponse = await client.getAccessToken();
      return `Bearer ${tokenResponse.token}`;
    } catch (error) {
      throw new Error('Token authentication failed: ' + error.message);
    }
  }

  async sendNotificationWithChannel(){
    const token = await this.getToken();
    console.log(token);
  }
}
