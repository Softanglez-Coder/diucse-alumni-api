import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * LoggingInterceptor
 *
 * This interceptor logs incoming requests and outgoing responses.
 * It logs the HTTP method, URL, and response status code along with the time taken to process the request.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    this.logger.log(`Request: ${method} ${url}`, context.getClass().name);

    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        this.logger.log(
          `Response: ${statusCode} ${method} ${url} - ${Date.now() - now}ms`,
          context.getClass().name,
        );

        return data;
      }),
    );
  }
}
