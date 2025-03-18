import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';

@Module({
  imports: [],
  controllers: [StreamController],
})
export class StreamModule {}
