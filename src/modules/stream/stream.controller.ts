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
    const playFirst = [];
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

  @Get('/suggest')
  async suggest(@Req() req: Request) {
    if (this.isReview(req)) {
      return [
        {
          name: 'Truyện ma',
          items: [
            {
              name: 'Ngôi nhà cuối hẻm',
              image:
                'https://radiotoday.net/wp-content/uploads/2014/06/truyen-ma-hay-nhat-bong-nguoi-duoi-trang-nguyen-ngoc-ngan.jpg',
              content:
                '\n\nCó một căn nhà nhỏ nằm cuối con hẻm tối, từ lâu không ai dám lại gần. Người ta bảo rằng, đêm nào ở đó cũng vang lên tiếng khóc của một đứa trẻ, xen lẫn tiếng lạch cạch như ai đó đang kéo ghế trong căn phòng trống rỗng.\n\nMột tối, nhóm bạn trẻ tò mò kéo nhau vào khám phá. Họ mang theo đèn pin, máy ghi âm và quyết tâm chứng minh “ma quỷ không có thật”.\n\nCăn nhà lạnh lẽo, đầy bụi và mạng nhện. Mùi ẩm mốc xộc thẳng vào mũi. Khi vừa bước qua ngưỡng cửa, một cánh cửa tự khép lại sau lưng họ, phát ra tiếng cạch khô khốc.\n\nTrong căn phòng khách, một chiếc ghế gỗ cũ kỹ từ từ… xoay lại, dù chẳng ai chạm vào. Đèn pin bỗng nhấp nháy liên tục, rồi vụt tắt. Trong bóng tối, một giọng trẻ con khe khẽ vang lên ngay sát tai:\n\n— “Chơi với em đi…”\n\nMột cô gái trong nhóm hét lên, nắm chặt tay bạn mình. Nhưng khi bật lại ánh sáng, tất cả đều chết lặng: người bạn đó… đã biến mất. Trên nền nhà chỉ còn lại một con búp bê với nụ cười nứt nẻ, đôi mắt thủy tinh ướt át như vừa khóc.\n\nTừ hôm đó, nhóm bạn chẳng bao giờ tụ tập lại nữa. Riêng căn nhà cuối hẻm, mỗi đêm, người ta vẫn nghe thấy tiếng búp bê thì thầm gọi:\n\n— “Chơi với em… cho đến hết đời…”',
              type: 'CONTENT',
            },
            {
              name: 'Phòng bảo vệ tập 1',
              image:
                'https://idep.edu.vn/upload/2025/02/che-anh-meme-hai-009.webp',
              content:
                ' Ngày xưa ở một làng nhỏ ven sông, có một cái giếng cổ đã bị bỏ hoang từ lâu. Người già trong làng kể rằng, giếng ấy từng là nơi một cô gái bị mất tích vào đêm trăng rằm. Từ đó, chẳng ai dám lại gần.\n\nMột đêm mùa đông, một chàng trai trẻ trong làng say rượu, lớn tiếng thách thức:\n— “Ma quỷ gì, toàn bịa đặt! Để tao xuống giếng này xem có gì nào!”\n\nAnh ta cầm đèn dầu, bước lại gần. Vừa đến miệng giếng, từ dưới sâu vọng lên ba tiếng gõ cốc… cốc… cốc… đều đặn như ai đó đang gõ vào đá.\n\nNgười làng hoảng sợ kéo anh ta lại, nhưng anh cười lớn rồi cúi xuống, soi đèn. Trong khoảnh khắc ánh sáng hắt xuống, người ta thấy một bàn tay trắng toát, đầy nước, nắm chặt lấy thành giếng.\n\nMọi người la hét bỏ chạy. Riêng chàng trai kia… không bao giờ trở về.\n\nTừ đó, vào đêm trăng sáng, làng lại nghe tiếng cốc… cốc… cốc… vang lên từ giếng cạn. Người ta đồn rằng, nếu ai dừng lại lắng nghe đủ ba tiếng gõ, sẽ nghe tiếp tiếng gọi khe khẽ:\n\n— “Xuống đây với tôi…”',
              type: 'CONTENT',
            },
          ],
        },
        {
          name: '[NO COPYRIGHT ANIMATION]',
          items: [
            {
              name: '[NO COPYRIGHT ANIMATION] Outer Space and Golden Stars with Sound Effect',
              image: 'https://img.youtube.com/vi/edw6hKHdiAE/sddefault.jpg',
              content:
                'https://shares-data.s3.ap-northeast-1.amazonaws.com/NO_COPYRIGHT_out_speace.mp4',
              type: 'LINK_PLAY',
            },
            {
              name: '[NO COPYRIGHT ANIMATION] 5-second Countdown Timer in Fire with Sound Effect',
              image: 'https://img.youtube.com/vi/EdwAiHpN1Mg/sddefault.jpg',
              content:
                'https://shares-data.s3.ap-northeast-1.amazonaws.com/NO_COPYRIGHT_time_5_second.mp4',
              type: 'LINK_PLAY',
            },
          ],
        },
      ];
    }
    return await this.service.getSuggest();
  }
}
