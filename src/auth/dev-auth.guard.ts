import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class DevAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isDevelopment = this.configService.get('nodeEnv') !== 'production';
    
    // In development, allow all requests with a mock user
    if (isDevelopment) {
      const request = context.switchToHttp().getRequest();
      request.user = {
        userId: 1,
        email: 'dev@example.com',
        roles: ['Admin'],
        employeeId: 1,
      };
      return true;
    }

    // In production, deny access (you should use proper JWT guard in production)
    return false;
  }
}