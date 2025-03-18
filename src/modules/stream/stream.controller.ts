import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
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
  async historyStream(@User() { user_oid }: any) {
    const playFirst = await this.service.getVieOn({
      type: 'VIEON',
    });
    const userHistory = await this.service.getVieOn({
      user_oid: new ObjectId(user_oid),
    });

    return playFirst.concat(...userHistory);
  }
}
