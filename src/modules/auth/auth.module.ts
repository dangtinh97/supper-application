import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrumtifyUser, DrumtifyUserSchema } from './schemas/drumtify-user';
import { DrumtifyAuthController } from './drumtify-auth.controller';
import { AuthService } from "./auth.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DrumtifyUser.name,
        schema: DrumtifyUserSchema,
      },
    ]),
  ],
  controllers: [DrumtifyAuthController],
  providers: [AuthService],
})
export class AuthModule {}
