import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Counter } from './schemas/counter.schema';
import { Model } from 'mongoose';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name)
    private counterModel: Model<Counter>,
  ) {}

  async getNextIndex(key: string) {
    const createOrUpdate = await this.counterModel.findOneAndUpdate(
      {
        key: key,
      },
      {
        $inc: {
          value: 1,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    );
    return createOrUpdate.value;
  }

  async getValueByKey(key: string): Promise<number> {
    const find = await this.counterModel.findOne({
      key: key,
    });
    return find ? find.value : 0;
  }
}
