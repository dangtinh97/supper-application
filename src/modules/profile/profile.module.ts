import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DrumtifyUser,
  DrumtifyUserSchema,
} from '../auth/schemas/drumtify-user';
import { ProfileController } from './profile.controller';
import { ProfileService } from "./profile.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DrumtifyUser.name,
        schema: DrumtifyUserSchema,
      },
    ]),
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
