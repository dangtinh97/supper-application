import { IsNumber, IsString } from 'class-validator';

export class AppConfig {
  @IsNumber()
  readonly APP_PORT: number;

  @IsString()
  readonly MONGODB_URI: string;

  @IsString()
  readonly BASE_URL: string;
}
