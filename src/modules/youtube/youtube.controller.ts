import { Controller, Get, Query } from "@nestjs/common";
import { YoutubeService } from "./youtube.service";

@Controller('youtube')
export class YoutubeController {
  constructor(
    private service: YoutubeService
  ) {}

  @Get('/url')
  async getYoutubeUrl(
    @Query("v") v: string
  ) {
    return await this.service.getVideo(v);
  }

  @Get('/suggest')
  async suggest(@Query('q') q: string) {
    return await this.service.suggest(q);
  }
  
  @Get('/find-video')
  async findVideo(
    @Query('q') q: string
  ){
    return await this.service.findVideoByKeyWord(q);
  }
}
