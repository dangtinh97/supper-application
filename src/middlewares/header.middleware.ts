import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { SettingService } from '../share_modules/setting/setting.service';
import { catchError, map, throwError } from 'rxjs';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  constructor(private appConfigService: SettingService) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    //throw new Error('Method not implemented.');
    const appVersion = parseInt(req.headers['app-version'] ?? '0', 0);
    const appName = req.headers['app-name'] ?? 'com.app.drumtifypro';
    let configAppVersion = await this.appConfigService.getDataByKey(
      `app_version_${appName}`,
    );
    if (!configAppVersion) {
      configAppVersion = {
        version: 0,
        type: '',
      };
    }
    if (
      appVersion < configAppVersion.version &&
      configAppVersion.type === 'UPDATE'
    ) {
      return res.status(200).json({
        status: 4003,
        message:
          'Bản cập nhật mới đã sẵn sàng! Trải nghiệm tốt hơn đang chờ bạn – cập nhật ngay nhé!',
        data: {},
      });
    }
    req.headers['app-review'] =
      appVersion === configAppVersion.version &&
      configAppVersion.type === 'REVIEW'
        ? 'true'
        : 'false';
    next();
  }
}
