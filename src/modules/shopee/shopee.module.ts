import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Affiliate, AffiliateSchema } from './schemas/affiliate.schema';
import { ShopeeService } from './shopee.service';
import { ShopeeController } from './shopee.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Affiliate.name,
        schema: AffiliateSchema,
      },
    ]),
  ],
  providers: [ShopeeService],
  controllers: [ShopeeController],
})
export class ShopeeModule {}
