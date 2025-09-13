import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';
import { StreamService } from './stream.service';
import { ObjectId } from 'mongodb';

@Controller('/streams')
@UseGuards(JwtAuthGuard)
export class StreamController {
  constructor(private readonly service: StreamService) {}

  @Get('/')
  async getStream(@Req() req, @Res() res) {
    return res.status(200).send({
      ...req.headers,
      ip: req.headers.ip || '127.0.0.1',
    });
  }

  @Get('/history')
  async historyStream(@Req() req: Request, @User() { user_oid }: any) {
    let playFirst = [];
    if (!this.isReview(req)) {
      let findRecomment = await this.service.getVieOn({
        type: 'RECOMMEND',
      });
      findRecomment = findRecomment.map((item)=>{
        return {
          ...item,
          type: 'URL_OF_USER',
        }
      })
      const vieon = await this.service.getVieOn({
        type: 'VIEON',
      });
      playFirst = findRecomment.concat(...vieon);
    }
    const userHistory = await this.service.getVieOn({
      user_oid: new ObjectId(user_oid),
    });

    return playFirst.concat(...userHistory.reverse());
  }

  isReview(req: Request) {
    return req.headers['app-review'] === 'true';
  }

  @Post('/')
  async saveStreamLink(@User() { user_oid }: any, @Body('url') url: string) {
    return await this.service.save(user_oid, url);
  }

  @Delete('/history/:id')
  async deleteStreamMe(@User() { user_oid }: any, @Param('id') id: string) {
    await this.service.delete(user_oid, id);
    return {};
  }
}
