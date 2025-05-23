import { ExceptionFilter } from '@nestjs/common/interfaces';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class BadRequestCustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const isCheck = [401, 426].indexOf(status) > -1;

    response.status(isCheck ? status : 200).json({
      status: status,
      data: {},
      message: exception.message,
    });
  }
}
