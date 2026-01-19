import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../guards/auth.guard';
import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';

@Controller('/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/')
  @Public()
  async home(@Req() req, @Res() res) {
    if (!req.user) {
      return res.redirect('/admin/login');
    }

    return res.redirect('/admin/dashboard');
  }

  @Public()
  @Get('/login')
  @Render('admin/login')
  async login() {
    return {};
  }

  @Public()
  @Post('/login')
  async attemptLogin(@Res() res: any, @Req() { body }: Request) {
    const attempt = await this.adminService.attempt(body);
    if (!attempt) {
      return res.redirect('/admin/login');
    }
    res.cookie('jwt', attempt.token, {});
    return res.redirect('/admin/dashboard');
  }

  @Get('/dashboard')
  @Render('admin/dashboard')
  async dashboard() {
    return await this.adminService.dashboard();
  }

  @Get('/setting')
  @Render('admin/setting')
  async homeSetting() {
    return await this.adminService.infoSetting();
  }

  @Post('/setting')
  async setting(@Req() req: any) {
    const { data, type }: any = req.body;
    if (type === 'UPDATE_VERSION') {
      await this.adminService.updateTypeVersionApp(data.id, data.type);
    }
    return {};
  }
}
