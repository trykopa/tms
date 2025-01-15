import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/services/users.service";
import { ILoginResponse } from "../types";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: Omit<User, 'password'>): ILoginResponse {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d', secret: process.env.REFRESH_TOKEN_SECRET }),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      const user = await this.usersService.findOne(decoded.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      return this.login(user);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}
