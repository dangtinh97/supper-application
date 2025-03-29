import { Module } from "@nestjs/common";
import { PhimController } from "./phim.controller";
import { PhimService } from "./phim.service";

@Module({
  imports: [],
  controllers: [PhimController],
  providers: [PhimService],
})
export class PhimModule{}
