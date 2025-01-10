import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { User } from "../../decorators/user.decorator";
@Controller('youtube')
@UseGuards(JwtAuthGuard)
export class YoutubeController {
  constructor(private service: YoutubeService) {}

  @Get('/url')
  async getYoutubeUrl(@Query('v') v: string) {
    return await this.service.getVideo(v);
  }

  @Get('/suggest')
  async suggest(@Query('q') q: string) {
    return await this.service.suggest(q);
  }

  @Get('/find-video')
  async findVideo(@Query('q') q: string, @User() { user_oid }: any) {
    console.log(user_oid);
    return await this.service.findVideoByKeyWord(q);
  }
}
