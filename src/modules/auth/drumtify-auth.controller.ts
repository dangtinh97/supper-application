import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from './auth.service';
import { HeaderGuard } from "../../guards/header.guard";

@Controller('/auth')
@UseGuards(HeaderGuard)
export class DrumtifyAuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  async login(@Req() req: Request) {
    console.log(req.headers);
  }
}
