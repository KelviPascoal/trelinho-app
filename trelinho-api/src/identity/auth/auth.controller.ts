import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import type { LoginPayload, RegisterPayload } from './auth.service';
import { JwtGuard } from './jwt.guard';

type AuthenticatedRequest = Request & {
  user?: {
    sub: string;
    email: string;
    name: string;
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() payload: RegisterPayload) {
    return this.authService.register(payload);
  }

  @Post('login')
  login(@Body() payload: LoginPayload) {
    return this.authService.login(payload);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  me(@Req() request: AuthenticatedRequest) {
    const userId = request.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.authService.me(userId);
  }
}
