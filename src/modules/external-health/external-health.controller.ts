import { Controller, Get } from "@nestjs/common";
import { ExternalHealthService } from "./external-health.service";

@Controller('external-health')
export class ExternalHealthController {
  constructor(
    private readonly service: ExternalHealthService
  ) {}
  
  
  @Get('/all')
  async checkAll(){
    return await this.service.checkHealthAll();
  }
}
