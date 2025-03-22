import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../decorators/user.decorator';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { YoutubeService } from '../youtube/youtube.service';

@Controller('/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private youtubeService: YoutubeService,
  ) {}

  @Get('/playlist/:id/videos')
  async videoInList(@Param('id') id: string) {
    return await this.userService.videoInList(id);
  }

  @Get('/playlist')
  async playList(@User() { user_oid }: any) {
    return await this.userService.myPlayList(user_oid);
  }

  @Post('/playlist')
  async createPlayList(@Body() data: any, @User() { user_oid }: any) {
    const name = data['name'] ?? 'No Name';

    await this.userService.createPlayList(user_oid, name);

    return await this.userService.myPlayList(user_oid);
  }

  @Post('/playlist/:id/track')
  async addTrack(@Body() data: any, @Param('id') id: string) {
    const videoId = data['video_id'] ?? 'No Name';
    return await this.userService.addTrack(id, videoId);
  }

  @Delete('/playlist/:id/track')
  async deleteFromTrack(
    @Query('video-id') videoId: string,
    @Param('id') id: string,
  ) {
    return await this.userService.deleteTrack(id, videoId);
  }

  @Delete('/playlist/:id')
  async deleteList(@Param('id') id: string, @User() { user_oid }: any) {
    await this.userService.deletePlayList(id);
    return await this.userService.myPlayList(user_oid);
  }

  @Post('/sync-playlist')
  async syncPlayList(
    @Body('name') name: string,
    @Body('data') data: string,
    @User() { user_oid }: any,
  ) {
    const playList = await this.userService.createPlayList(user_oid, name);
    const ids = await this.youtubeService.videoOfPlayList(JSON.parse(data));
    for (const id of ids) {
      await this.userService.addTrack(playList.id, id);
    }
    return {
      count_video: ids.length,
    };
  }
}
