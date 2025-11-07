import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { RequestUserService } from '../services/request-user.service';
import { UserInfo } from '../dtos/user-info.dto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private requestUserService: RequestUserService,
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
          (req as any).user = userInfo; // Also attach to request for compatibility
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

      // Extract user information from Azure AD token
      const userInfo: UserInfo = {
        userId: payload.sub || payload.oid,
        email: payload.email || payload.preferred_username,
        name: payload.name,
        roles: payload.roles || [],
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

      return userInfo;
    } catch (error) {
      throw new Error(`Failed to extract user info: ${error.message}`);
    }
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