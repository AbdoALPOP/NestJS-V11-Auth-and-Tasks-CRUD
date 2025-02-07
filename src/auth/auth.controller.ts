import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDot } from 'src/dot/auth.dot';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() createUserDto: AuthDot): Promise<AuthDot> {
    return await this.authService.createUser(createUserDto);
  }
  @Post('signIn')
  async signIn(
    @Body() createUserDto: AuthDot,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(createUserDto);
  }
}
