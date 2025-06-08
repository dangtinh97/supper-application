import { Controller, Get } from '@nestjs/common';
import { ShopeeService } from './shopee.service';

@Controller('/shopee')
export class ShopeeController{
  constructor(
    private readonly shopeeService:ShopeeService
  ) {
  }

  @Get('/link')
  async links(){
    return await this.shopeeService.link();
  }
}