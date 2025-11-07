import { Injectable, Scope } from '@nestjs/common';
import { UserInfo } from '../dtos/user-info.dto';

// Request-scoped service to store user information
@Injectable({ scope: Scope.REQUEST })
export class RequestUserService {
  private user: UserInfo | null = null;

  setUser(user: UserInfo): void {
    this.user = user;
  }

  getUser(): UserInfo | null {
    return this.user;
  }

  getUserId(): string | null {
    return this.user?.userId || null;
  }

  getUserEmail(): string | null {
    return this.user?.email || null;
  }

  getUserRoles(): string[] {
    return this.user?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  isPortalUser(): boolean {
    return this.hasAnyRole(['ati-portal-user', 'ati-portal-admin']);
  }

  isPortalAdmin(): boolean {
    return this.hasRole('ati-portal-admin');
  }
}