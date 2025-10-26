import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Bypass JWT authentication in development mode
    const isDevelopment = this.configService.get('nodeEnv') !== 'production';
    if (isDevelopment) {
      const request = context.switchToHttp().getRequest();
      // Set a mock user for development
      request.user = {
        userId: 1,
        email: 'dev@example.com',
        roles: ['Admin'],
        employeeId: 1,
      };
      return true;
    }

    return super.canActivate(context);
  }
}