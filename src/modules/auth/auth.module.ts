import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrumtifyUser, DrumtifyUserSchema } from './schemas/drumtify-user';
import { DrumtifyAuthController } from './drumtify-auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DrumtifyUser.name,
        schema: DrumtifyUserSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET')!,
          signOptions: { expiresIn: '1y' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [DrumtifyAuthController],
  providers: [AuthService],
})
export class AuthModule {}
