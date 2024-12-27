import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogTelegram, LogTelegramSchema } from './schemas/log-telegram.schema';
import { LogService } from './log.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LogTelegram.name,
        schema: LogTelegramSchema,
      },
    ]),
  ],
  exports: [LogService],
  providers: [LogService],
})
export class LogModule {}
