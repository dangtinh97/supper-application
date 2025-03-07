import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';
import * as _ from 'lodash';

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
  async viewVideo(
    @Req() request: any,
    @Body() body: any,
    @User() { user_oid }: any,
  ) {
    if (this.isReview(request)) {
      return {};
    }
    return await this.service.viewVideo(body.video_id, user_oid);
  }

  @Get('/recently-video')
  async recentlyVideo(
    @User() { user_oid }: any,
    @Query('type') type: string = 'me',
    @Req() req: Request,
  ) {
    if (this.isReview(req)) {
      return await this.service.noCopyRightSounds();
    }
    return await this.service.recentlyVideo(type === 'me' ? user_oid : null);
  }

  @Get('/top-channel-view')
  async topChannelView() {
    return this.service.topChannelList();
  }

  @Post('/music-trend')
  async musicTrend(@Req() req: Request, @Body() data: any) {
    if (this.isReview(req)) {
      return await this.service.noCopyRightSounds();
    }
    return this.service.musicNew(JSON.parse(data['data']));
  }

  @Get('/top10')
  async top10(@Req() req: Request) {
    if (this.isReview(req)) {
      return await this.service.noCopyRightSounds();
    }
    return await this.service.top10();
  }

  @Post('/video-suggest-by-id')
  async videoSuggestById(@Body() data: any) {
    return this.service.saveAndFilterVideoSuggest(
      typeof data['data'] === 'string'
        ? JSON.parse(data['data'])
        : data['data'],
    );
  }

  @Get('/trending')
  async videoTrending(@Req() req: Request) {
    if (this.isReview(req)) {
      return await this.service.noCopyRightSounds();
    }
    return await this.service.videoTrending();
  }

  isReview(req: Request) {
    return req.headers['app-review'] === 'true';
  }

  @Post('/short-next')
  async shortNext(@Req() request: any, @Body() body: any) {
    const data = JSON.parse(body['data'])['entries'];
    return data.map((item:any) => {
      return {
        video_id: _.get(item, 'command.reelWatchEndpoint.videoId'),
        thumbnail: _.get(
          item,
          'command.reelWatchEndpoint.thumbnail.thumbnails.0.url',
        ),
        title: '',
        duration: 0,
        view_of_ytb: 0,
        channel: {
          name: '',
          channel_id: '',
          thumbnail: '',
          thumbnails: [],
        },
      };
    });
  }
}
