import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies?.refresh_token || request.body?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      // Attach the token payload to the request (if needed later)
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
