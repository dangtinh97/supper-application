import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { isArray } from 'node:util';
import * as _ from 'lodash';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    const handler = context.getHandler();
    const customResponse = this.reflector.get<{ message: string }>(
      'message',
      handler,
    );
    let message = statusCode >= 400 ? 'Error' : 'Success';
    if (customResponse) {
      message = customResponse.message;
    }
    console.log(customResponse);
    return next.handle().pipe(
      map((data) => {
        if (_.get(data, 'status') === 0) {
          response.status(200);
          response.setHeader("Content-Type", "text/event-stream");
          response.setHeader("Cache-Control", "no-cache");
          response.setHeader("Connection", "keep-alive");

          response.write(`data: ${JSON.stringify(data)}\n\n`);
          return
        }
        return {
          status: 200,
          message: message,
          data: data ? (isArray(data) ? { list: data } : data) : {},
        };
      }),
      catchError((err) => {
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
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
}
