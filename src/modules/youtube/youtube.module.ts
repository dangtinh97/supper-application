import { Module } from '@nestjs/common';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Youtube, YoutubeSchema } from './schemas/youtube.schema';
import { RecentlyVideo, RecentlyVideoSchema } from './schemas/recently_video';
import {
  SearchKeyword,
  SearchKeywordSchema,
} from './schemas/search-keyword.schema';
import {
  VideoPlaylist,
  VideoPlaylistSchema,
} from '../user/schemas/video-playlist.schema';
import { CounterModule } from '../../share_modules/counter/counter.module';
import {
  FavoriteChannel,
  FavoriteChannelSchema,
} from './schemas/channel-favorite.schema';

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
      {
        name: SearchKeyword.name,
        schema: SearchKeywordSchema,
      },
      {
        name: VideoPlaylist.name,
        schema: VideoPlaylistSchema,
      },
      {
        name: FavoriteChannel.name,
        schema: FavoriteChannelSchema,
      },
    ]),
    CounterModule,
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService],
  exports: [YoutubeService],
})
export class YoutubeModule {}
