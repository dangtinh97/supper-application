import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Affiliate } from './schemas/affiliate.schema';
import { Model } from 'mongoose';

@Injectable()
export class ShopeeService {
  constructor(
    @InjectModel(Affiliate.name)
    private readonly affiliateModel: Model<Affiliate>,
  ) {}

  async link() {
    return await this.affiliateModel
      .find({
        show: true,
      })
      .sort({
        order: 1,
      })
      .exec();
  }
}
