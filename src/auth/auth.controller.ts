import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger'; // 🚨 1. استدعاء ApiTags

@ApiTags('Auth') // 2. تصنيف كل الروابط تحت "Auth" في Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signupDto: SignupDto): Promise<void> {
    return this.authService.signUp(signupDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}