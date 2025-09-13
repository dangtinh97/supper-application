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
    return await this.service.recentlyVideo(
      type === 'me' ? user_oid : null,
      req.headers['lang'] ?? 'vi',
    );
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
    const dataParse = typeof data['data'] === 'string'
        ? JSON.parse(data['data'])
        : data['data'];
    if (dataParse.length > 1 && _.get(dataParse,'0.lockupViewModel')) {
      return await this.service.suggestVideoByIdV2(dataParse);
    }
    return await this.service.saveAndFilterVideoSuggest(dataParse);
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
    if (this.isReview(request)) {
      return this.service.noCopyRightSounds();
    }
    const data = JSON.parse(body['data'])['entries'];
    return data.map((item: any) => {
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

  @Post('/video')
  async addInfoVideoById(@Body('data') data: string) {
    return await this.service.addVideoInfo(JSON.parse(data));
  }

  @Post('/video-channel')
  async addVideoChannel(@Body() body: any){
    const list = JSON.parse(body['list']);
    const channel = JSON.parse(body['channel']);
    return await this.service.videoOfChannel(list,channel);
  }
  
  @Get('/set-language-title')
  async setLanguageTitle(){
    return await this.service.setLanguageTitle();
  }
}
