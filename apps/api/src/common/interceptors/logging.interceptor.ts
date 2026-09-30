import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = ctx.getResponse();
          const statusCode = response.statusCode;
          const delay = Date.now() - now;
          this.logger.log(
            `[HTTP Response] ${method} ${url} ${statusCode} - ${delay}ms - ${ip} "${userAgent}"`,
          );
        },
        error: (error) => {
          const delay = Date.now() - now;
          const status = error?.status || 500;
          this.logger.warn(
            `[HTTP Error] ${method} ${url} ${status} - ${delay}ms - ${ip} "${userAgent}"`,
          );
        },
      }),
    );
  }
}
