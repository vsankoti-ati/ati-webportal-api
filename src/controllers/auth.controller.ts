import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Public } from '../auth/public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('azure')
  @UseGuards(AuthGuard('azure-ad'))
  async azureLogin() {
    // This route will be called by the frontend to initiate Azure AD login
    return;
  }

  @Post('azure/callback')
  @UseGuards(AuthGuard('azure-ad'))
  async azureCallback(@Request() req) {
    // This route will be called by Azure AD after successful authentication
    return this.authService.login(req.user);
  }

  @Get('profile')
  //@UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user;
  }
}