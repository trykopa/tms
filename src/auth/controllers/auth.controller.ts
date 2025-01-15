import { Controller, Post, Body, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { RefreshTokenGuard } from "../../common/guards/refresh.guard";
import { UsersService } from "../../users/services/users.service";
import { LoginDto, RefreshTokenDto, RegisterDto } from "../dto/auth.dto";
import { AuthService } from "../services/auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const { password: _, ...result } = user;
    return result;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @ApiBearerAuth('refresh_token')
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }
}
