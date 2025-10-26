import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'azure-ad') {
  constructor(private configService: ConfigService) {
    super({
      identityMetadata: `https://login.microsoftonline.com/${configService.get('AZURE_AD_TENANT_ID')}/v2.0/.well-known/openid-configuration`,
      clientID: configService.get('AZURE_AD_CLIENT_ID'),
      validateIssuer: true,
      passReqToCallback: false,
      issuer: `https://sts.windows.net/${configService.get('AZURE_AD_TENANT_ID')}/`,
      audience: configService.get('AZURE_AD_CLIENT_ID'),
    });
  }

  async validate(payload: any) {
    // Extract roles from the payload
    const roles = payload.roles || [];
    return {
      email: payload.preferred_username,
      name: payload.name,
      roles,
      sub: payload.sub,
    };
  }
}