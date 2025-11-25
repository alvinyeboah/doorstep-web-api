import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from '../../lib/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        throw new UnauthorizedException('Not authenticated');
      }

      request.user = session.user;
      request.session = session.session;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
  }
}
