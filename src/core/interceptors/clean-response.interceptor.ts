import { Injectable, NestInterceptor, Logger, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class CleanResponseInterceptor implements NestInterceptor {
  private removeNulls(obj: any): any {
    return obj;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.removeNulls(data);
      }),
    );
  }
}