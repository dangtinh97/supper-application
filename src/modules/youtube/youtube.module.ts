import { Module } from '@nestjs/common';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Youtube, YoutubeSchema } from './schemas/youtube.schema';
import { RecentlyVideo, RecentlyVideoSchema } from './schemas/recently_video';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Youtube.name,
        schema: YoutubeSchema,
      },
      {
        name: RecentlyVideo.name,
        schema: RecentlyVideoSchema,
      },
    ]),
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService],
  exports: [YoutubeService],
})
export class YoutubeModule {}
