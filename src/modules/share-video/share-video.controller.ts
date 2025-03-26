import { Controller, Get, Query, Render, Req } from '@nestjs/common';
import { YoutubeService } from "../youtube/youtube.service";
@Controller('share')
export class ShareVideoController {
  constructor (private youtubeService: YoutubeService) {}
  @Get('/')
  @Render('share')
  async index(@Query('v') videoId: string) {
    const info = await this.youtubeService.getVideo(videoId);
    return {
      image: `http://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      title: info.title,
    };
  }
}
