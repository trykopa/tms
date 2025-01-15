import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";

import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Unauthorized');
      }

      const token = authorization.split(' ')[1];
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET
      });
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
