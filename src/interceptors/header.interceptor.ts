import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { SettingService } from '../share_modules/setting/setting.service';
import { isArray } from 'node:util';

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
  constructor(private appConfigService: SettingService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const appVersion = parseInt(request.headers['app-version'] ?? '0', 0);
    const appName = request.headers['app-name'] ?? '';
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
      return next.handle().pipe(
        map(() => ({
          status: 4003,
          message:
            'Bản cập nhật mới đã sẵn sàng! Trải nghiệm tốt hơn đang chờ bạn – cập nhật ngay nhé!',
          data: {},
        })),
        catchError((err) => {
          const statusCode =
            err instanceof HttpException ? err.getStatus() : 500;
          const errorResponse = {
            statusCode,
            message: err.message || 'Internal server error',
            error: err.name || 'Error',
            timestamp: Date.now(),
            version: 'v2',
            path: request.url,
            data: {},
          };
          return throwError(() => new HttpException(errorResponse, statusCode));
        }),
      );
    }
    response.setHeader(
      'app-review',
      appVersion === configAppVersion.version &&
        configAppVersion.type === 'REVIEW'
        ? 'true'
        : 'false',
    );
    return next.handle();
    // Lấy giá trị của os-version từ header
  }
}
