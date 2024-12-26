import { Module } from '@nestjs/common';
import { ExternalHealthService } from "./external-health.service";
import { ExternalHealthController } from "./external-health.controller";

@Module({
  imports: [],
  providers: [ExternalHealthService],
  controllers: [ExternalHealthController],
  exports: [],
})
export class ExternalHealthModule {}
