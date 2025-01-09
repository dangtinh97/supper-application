import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DrumtifyUser } from './schemas/drumtify-user';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(DrumtifyUser.name)
    private readonly drumtifyUserModel: Model<DrumtifyUser>,
  ) {}
  
  
}
