import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { RequestUserService } from '../services/request-user.service';
import { UserInfo } from '../dtos/user-info.dto';
import { Repository } from 'typeorm';
import { Employee } from 'src/entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeService } from 'src/services/employee.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private requestUserService: RequestUserService,
    private readonly employeeService: EmployeeService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const isDevelopment = false; //this.configService.get('nodeEnv') !== 'production';

      // In development, set mock user
      if (isDevelopment) {
        const mockUser: UserInfo = {
          userId: 'dev-user-123',
          email: 'dev@example.com',
          name: 'Development User',
          roles: ['ati-portal-admin'],
          tenantId: 'dev-tenant',
          appId: 'dev-app',
          objectId: 'dev-object-id',
          preferredUsername: 'dev@example.com',
        };

        this.requestUserService.setUser(mockUser);
        (req as any).user = mockUser; // Also attach to request for compatibility
        return next();
      }

      // Production: Extract and validate Azure AD token
      const token = this.extractTokenFromHeader(req);
      if (token) {
        try {
          const userInfo = await this.validateAndExtractUserInfo(token);
          this.requestUserService.setUser(userInfo);
          (   req as any).user = userInfo; // Also attach to request for compatibility
        } catch (error) {
          console.warn('Failed to validate Azure AD token:', error.message);
          // Don't throw error here - let guards handle authentication
          // This middleware is just for parsing user info when available
        }
      }

      next();
    } catch (error) {
      console.error('AuthMiddleware error:', error);
      next(); // Continue without user info
    }
    }

  private extractTokenFromHeader(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private async validateAndExtractUserInfo(token: string): Promise<UserInfo> {
    try {
      // Decode token payload (without verification for middleware - guards will verify)
      const payload = this.decodeTokenPayload(token);

      // Basic expiration check
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new Error('Token expired');
      }

      // Extract roles from multiple possible claims
      //const roles = this.extractRoles(payload);
      const roles = await this.extractRolesFromDb(payload.upn);
      if (roles.length === 0) {
        throw new Error('Not an authorized user');
      }

      // Extract user information from Azure AD token
      const userInfo: UserInfo = {
        userId: payload.sub || payload.oid,
        email: payload.email || payload.preferred_username || payload.upn,
        name: payload.name,
        roles: roles,
        tenantId: payload.tid,
        appId: payload.aud,
        objectId: payload.oid,
        preferredUsername: payload.preferred_username,
        // Include additional claims
        upn: payload.upn,
        given_name: payload.given_name,
        family_name: payload.family_name,
        groups: payload.groups || [],
      };

      // Debug log to help troubleshoot roles
      console.log('🔍 Token Claims Debug:', {
        roles: payload.roles,
        app_roles: payload.app_roles,
        wids: payload.wids,
        groups: payload.groups,
        extractedRoles: roles,
        hasRoles: roles && roles.length > 0
      });

      return userInfo;
    } catch (error) {
      throw new Error(`Failed to extract user info: ${error.message}`);
    }
  }

  private async extractRolesFromDb(email: string): Promise<string[]> {
    try{
      if (!email) {
        return [];
      }
      const user =  await this.employeeService.findByEmail(email);
      
      if(user.roles && user.roles.length > 0){
        return user.roles.map(role => role.name);
      }
        
    }
    catch(error){
      console.error('Error fetching user roles from DB:', error);
      return [];
    }
    return ['ati-portal-user']; // Default role if user exists but no roles found
  }

  private extractRoles(payload: any): string[] {
    // Try multiple possible locations for roles in the token
    const roles: string[] = [];

    // Standard roles claim (most common)
    if (payload.roles && Array.isArray(payload.roles)) {
      roles.push(...payload.roles);
    }

    // App roles claim (sometimes used)
    if (payload.app_roles && Array.isArray(payload.app_roles)) {
      roles.push(...payload.app_roles);
    }

    // Directory roles (wids - well-known IDs)
    if (payload.wids && Array.isArray(payload.wids)) {
      roles.push(...payload.wids);
    }

    // Custom role claim (configurable)
    const customRolesClaim = this.configService.get('azureAd.rolesClaim') || 'roles';
    if (customRolesClaim !== 'roles' && payload[customRolesClaim] && Array.isArray(payload[customRolesClaim])) {
      roles.push(...payload[customRolesClaim]);
    }

    // Remove duplicates and return
    return [...new Set(roles)];
  }

  private decodeTokenPayload(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      if (!base64Payload) {
        throw new Error('Invalid token format');
      }

      // Add padding if needed
      const paddedPayload = base64Payload.padEnd(
        base64Payload.length + ((4 - (base64Payload.length % 4)) % 4),
        '='
      );

      const payload = Buffer.from(paddedPayload, 'base64').toString('utf8');
      return JSON.parse(payload);
    } catch (error) {
      throw new Error('Failed to decode token payload');
    }
  }
}