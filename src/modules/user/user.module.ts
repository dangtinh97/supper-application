import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DrumtifyUser,
  DrumtifyUserSchema,
} from '../auth/schemas/drumtify-user';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DrumtifyUser.name,
        schema: DrumtifyUserSchema,
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
