import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: configService.get('nodeEnv') !== 'production',
      secretOrKey: configService.get('JWT_SECRET') || 'dev-secret-key',
    });
  }

  async validate(payload: any) {
    // In development mode, return a mock user if no valid token is provided
    const isDevelopment = this.configService.get('nodeEnv') !== 'production';
    
    if (isDevelopment && !payload) {
      return {
        userId: 1,
        email: 'dev@example.com',
        roles: ['Admin'],
        employeeId: 1,
      };
    }

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      employeeId: payload.employeeId,
    };
  }
}