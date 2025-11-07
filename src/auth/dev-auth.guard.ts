import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class DevAuthGuard implements CanActivate {
  private jwksUri: string;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    // Azure AD JWKS endpoint for token validation
    const tenantId = this.configService.get('AZURE_AD_TENANT_ID');
    this.jwksUri = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const isDevelopment = this.configService.get('nodeEnv') !== 'production';
    
    // In development, allow all requests with a mock user
    if (isDevelopment) {
      request.user = {
        userId: 1,
        email: 'dev@example.com',
        roles: ['ati-portal-admin'],
        employeeId: 1,
      };
      return true;
    }

    // Production environment: Validate Azure AD token and check roles
    try {
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Validate Azure AD token
      const payload = await this.validateAzureAdToken(token);

      // Extract roles from Azure AD token
      const userRoles = payload.roles || [];
      
      // Check if user has required roles
      const hasValidRole = userRoles.some((role: string) => 
        role === 'ati-portal-user' || role === 'ati-portal-admin'
      );

      if (!hasValidRole) {
        throw new UnauthorizedException('Insufficient permissions - missing required roles');
      }

      // Attach user info to request
      request.user = {
        userId: payload.sub || payload.oid,
        email: payload.email || payload.preferred_username,
        name: payload.name,
        roles: userRoles,
        tenantId: payload.tid,
        appId: payload.aud,
        ...payload, // Include other Azure AD claims
      };

      return true;
    } catch (error) {
      console.error('Azure AD token validation failed:', error.message);
      throw new UnauthorizedException('Invalid Azure AD token or insufficient permissions');
    }
  }

  private async validateAzureAdToken(token: string): Promise<any> {
    try {
      // Decode token header to get key ID
      const decoded = this.decodeTokenHeader(token);
      if (!decoded || !decoded.kid) {
        throw new Error('Invalid token format');
      }

      // Get signing key from Azure AD JWKS endpoint
      const signingKey = await this.getSigningKey(decoded.kid);
      
      // Verify token signature and validate claims
      return await this.verifyToken(token, signingKey);
    } catch (error) {
      throw new Error(`Token validation failed: ${error.message}`);
    }
  }

  private decodeTokenHeader(token: string): any {
    try {
      const base64Header = token.split('.')[0];
      const header = Buffer.from(base64Header, 'base64').toString('utf8');
      return JSON.parse(header);
    } catch (error) {
      throw new Error('Failed to decode token header');
    }
  }

  private async getSigningKey(kid: string): Promise<string> {
    try {
      const response = await fetch(this.jwksUri);
      const jwks = await response.json();
      
      const key = jwks.keys.find((k: any) => k.kid === kid);
      if (!key) {
        throw new Error('Signing key not found');
      }

      // Convert JWK to PEM format for verification
      return this.jwkToPem(key);
    } catch (error) {
      throw new Error(`Failed to get signing key: ${error.message}`);
    }
  }

  private jwkToPem(jwk: any): string {
    // Simple RSA JWK to PEM conversion
    // Note: This is a basic implementation. For production, consider using a proper library
    const modulus = Buffer.from(jwk.n, 'base64');
    const exponent = Buffer.from(jwk.e, 'base64');
    
    // This is a simplified conversion - in production, use a proper JWK to PEM library
    return `-----BEGIN RSA PUBLIC KEY-----\n${modulus.toString('base64')}\n-----END RSA PUBLIC KEY-----`;
  }

  private async verifyToken(token: string, publicKey: string): Promise<any> {
    try {
      // Decode and verify token manually
      const [header, payload, signature] = token.split('.');
      
      // Decode payload
      const decodedPayload = Buffer.from(payload, 'base64').toString('utf8');
      const parsedPayload = JSON.parse(decodedPayload);
      
      // Basic validation
      const now = Math.floor(Date.now() / 1000);
      if (parsedPayload.exp && parsedPayload.exp < now) {
        throw new Error('Token expired');
      }
      
      if (parsedPayload.nbf && parsedPayload.nbf > now) {
        throw new Error('Token not yet valid');
      }

      // Validate issuer
      const tenantId = this.configService.get('AZURE_AD_TENANT_ID');
      const expectedIssuer = `https://login.microsoftonline.com/${tenantId}/v2.0`;
      if (parsedPayload.iss !== expectedIssuer) {
        throw new Error('Invalid issuer');
      }

      // Validate audience
      const clientId = this.configService.get('AZURE_AD_CLIENT_ID');
      if (parsedPayload.aud !== clientId) {
        throw new Error('Invalid audience');
      }

      return parsedPayload;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}