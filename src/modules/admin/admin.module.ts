import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schemas/admin.schema';
import { Admin } from 'mongodb';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from '../user/user.controller';
import { UserModule } from '../user/user.module';
import { SettingModule } from '../../share_modules/setting/setting.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AdminSchema,
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
    UserModule,
    SettingModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
