import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
}

/**
 * Global response transform interceptor
 * Wraps all successful responses in a consistent format with metadata
 *
 * Response format:
 * {
 *   data: {...},
 *   statusCode: 200,
 *   timestamp: "2024-01-01T00:00:00.000Z",
 *   path: "/api/products"
 * }
 *
 * Note: This interceptor is opt-in via @Transform() decorator
 * to avoid breaking existing response formats
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}
