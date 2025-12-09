import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PAGINATE_KEY } from '../decorators/paginate.decorator';

/**
 * Global pagination interceptor
 * Automatically paginates responses for endpoints decorated with @Paginate()
 *
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 *
 * Response format:
 * {
 *   data: [...],
 *   pagination: {
 *     page: 1,
 *     limit: 20,
 *     total: 100,
 *     totalPages: 5
 *   }
 * }
 */
@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isPaginated = this.reflector.get<boolean>(
      PAGINATE_KEY,
      context.getHandler(),
    );

    if (!isPaginated) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const page = Math.max(1, parseInt(request.query.page) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(request.query.limit) || 20),
    );

    // Add pagination params to request for service layer
    request.pagination = { page, limit, skip: (page - 1) * limit };

    return next.handle().pipe(
      map((data) => {
        // If data is already paginated (has data and pagination keys), return as is
        if (data && typeof data === 'object' && 'data' in data && 'pagination' in data) {
          return data;
        }

        // If data is an array, paginate it
        if (Array.isArray(data)) {
          const total = data.length;
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedData = data.slice(startIndex, endIndex);

          return {
            data: paginatedData,
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
            },
          };
        }

        // If data is not an array, return as is
        return data;
      }),
    );
  }
}
