import { Injectable } from '@nestjs/common';
import { SettingService } from '../../share_modules/setting/setting.service';
const _ = require('lodash');
@Injectable()
export class GeminiService {
  constructor(private readonly settingService: SettingService) {}

  async sendData(messages: any) {
    const key = await this.settingService.getDataByKey('GEMINI_API_KEY');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`;
    const data = {
      contents: [
        {
          parts: messages,
        },
      ],
    };
    const curl = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await curl.json();
    console.log(json);
    return _.get(json, 'candidates[0].content.parts[0].text');
  }
}
