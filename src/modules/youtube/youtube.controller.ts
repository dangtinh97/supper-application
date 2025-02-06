import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';

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

  @Post('/view-log')
  async viewVideo(@Body() body: any, @User() { user_oid }: any) {
    return await this.service.viewVideo(body.video_id, user_oid);
  }

  @Get('/recently-video')
  async recentlyVideo(
    @User() { user_oid }: any,
    @Query('type') type: string = 'me',
  ) {
    return await this.service.recentlyVideo(type === 'me' ? user_oid : null);
  }

  @Get('/top-channel-view')
  async topChannelView() {
    return this.service.topChannelList();
  }

  @Post('/music-trend')
  async musicTrend(@Body() data: any){
    return this.service.musicNew(JSON.parse(data['data']));
  }
}
