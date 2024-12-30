import { HttpException } from '@nestjs/common';

export class BadRequestCustomException extends HttpException {
  constructor(message: string = 'Bad request.', status: number = 400) {
    super(message, status);
  }
}
