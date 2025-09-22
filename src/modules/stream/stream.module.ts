import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkStream, LinkStreamSchema } from './schemas/link-stream.schema';
import { StreamService } from './stream.service';
import { Suggest, SuggestSchema } from './schemas/suggest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LinkStream.name,
        schema: LinkStreamSchema,
      },
      {
        name: Suggest.name,
        schema: SuggestSchema,
      },
    ]),
  ],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
