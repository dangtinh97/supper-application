import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DrumtifyUser,
  DrumtifyUserSchema,
} from '../auth/schemas/drumtify-user';
import { UserService } from './user.service';
import { VideoPlaylist, VideoPlaylistSchema } from "./schemas/video-playlist.schema";
import { UserController } from "./user.controller";
import { YoutubeModule } from "../youtube/youtube.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DrumtifyUser.name,
        schema: DrumtifyUserSchema,
      },
      {
        name: VideoPlaylist.name,
        schema: VideoPlaylistSchema,
      },
    ]),
    YoutubeModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
