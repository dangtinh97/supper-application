import { Module } from "@nestjs/common";
import { ShareVideoController } from "./share-video.controller";
import { YoutubeModule } from "../youtube/youtube.module";

@Module({
  imports: [YoutubeModule],
  controllers: [ShareVideoController],
})
export class ShareVideoModule {}
