import { HttpException } from './http-exception';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(404, message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}
