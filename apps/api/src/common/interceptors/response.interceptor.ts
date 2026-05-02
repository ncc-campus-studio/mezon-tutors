import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, PaginatedResponse } from '@mezon-tutors/shared';
import { SKIP_API_RESPONSE_WRAP_KEY } from '../decorators/skip-api-response-wrap.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | PaginatedResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse<T> | PaginatedResponse<T>> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_API_RESPONSE_WRAP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) {
      return next.handle() as Observable<ApiResponse<T>>;
    }

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
