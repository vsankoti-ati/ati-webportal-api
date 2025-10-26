import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: any): Promise<any> {
    // Validate the user from Azure AD payload
    if (!payload) {
      throw new UnauthorizedException();
    }
    return payload;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.sub,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }
}