import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogTelegram } from './schemas/log-telegram.schema';
import { Model } from 'mongoose';
import { LevelLog } from './dto/enum-level-log.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(LogTelegram.name)
    private readonly logTelegramModel: Model<LogTelegram>,
  ) {}

  async saveLogTelegram(
    message: string,
    data: any,
    level: LevelLog = LevelLog.INFO,
  ) {
    await this.logTelegramModel.create({
      message,
      data,
      level,
    });
  }
}
