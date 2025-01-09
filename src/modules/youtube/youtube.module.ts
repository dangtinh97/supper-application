import { Module } from '@nestjs/common';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Youtube, YoutubeSchema } from "./schemas/youtube.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Youtube.name,
        schema: YoutubeSchema,
      },
    ]),
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService],
})
export class YoutubeModule {}
