import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ExternalHealthService } from "./modules/external-health/external-health.service";

@Injectable()
export class TaskService {
  constructor (
    private readonly checkHealthService: ExternalHealthService
  ) {}
  private readonly logger = new Logger(TaskService.name);
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.checkHealthService.checkHealthAll().then(()=> {
    
    });
    this.logger.debug('Called every minute');
  }
}
