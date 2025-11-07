import { CanActivate, ExecutionContext, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphInspector, Reflector } from '@nestjs/core';
import { RequestUserService } from 'src/services/request-user.service';

export const Roles = Reflector.createDecorator<string[]>();
@Injectable({scope: Scope.REQUEST})
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, 
    private readonly requestUserService: RequestUserService,
    private readonly configService: ConfigService) {}

  private isInDebugMode(): boolean {
    return false; 
    // !this.configService.get('nodeEnv') || this.configService.get('nodeEnv') === 'DEV';
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles || this.isInDebugMode()) {
      return true;
    }

    let user = this.requestUserService.getUser();

    //const { user } = context.switchToHttp().getRequest();
    return (user == null || user.roles === null) ? true : requiredRoles.some((role) => user.roles?.includes(role));
  }
}