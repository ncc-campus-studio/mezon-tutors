import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, PaginatedResponse } from '@mezon-tutors/shared';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | PaginatedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse<T> | PaginatedResponse<T>> {
    const request = context
      .switchToHttp()
      .getRequest<{ originalUrl?: string; url?: string; path?: string }>();

    return next.handle().pipe(
      map((data) => {
        return {
          data,
          error: null,
        };
      })
    );
  }
}
