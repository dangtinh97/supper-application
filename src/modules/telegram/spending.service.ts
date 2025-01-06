import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { TelegramService } from './telegram.service';

@Injectable()
export class SpendingService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly telegramService: TelegramService,
  ) {}

  async spendingDaily(text: string, telegramId: number): Promise<void> {
    const response = await this.geminiService.sendData([
      {
        text: 'Bạn sẽ là trợ lý giúp tôi ghi chép chi tiêu, với 1 nhân cách đanh đá.',
      },
      {
        text: 'bạn phân tích giúp tôi, loại chi tiêu, cộng hay trừ tiền, chi tiêu cho việc gì, và trả ra kết quả cuối dạng json có cấu trúc ví dụ{type:"ăn uống","money":"1000000","status":"DEBIT/ADD","content":"<Content là câu nói của bạn cho vấn đề chi tiêu>"}',
      },
      {
        text: `\"${text}\"`,
      },
      {
        text: 'Kết quả cuối cùng tôi muốn nhận là "json", không trả ra thêm giải thích hay bất kỳ thông tin nào khác',
      },
    ]);
    await this.telegramService.sendMessage({
      chat_id: telegramId.toString(),
      text: response,
      parse_mode: 'html',
    });
  }
}
