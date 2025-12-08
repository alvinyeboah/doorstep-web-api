import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../lib/auth';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * AuthGuard using Better Auth's session system
 * Works with cookies automatically - no manual token handling needed
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Get session using Better Auth API - it handles cookies automatically
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    // Attach session and user to request
    (request as any).session = session;
    (request as any).user = session?.user ?? null;

    // If no session, throw unauthorized
    if (!session) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized - no valid session found',
      });
    }

    return true;
  }
}
