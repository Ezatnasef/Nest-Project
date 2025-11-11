// src/auth/guards/jwt-auth.guard.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { // 'jwt' هو اسم الاستراتيجية
  // هذا Guard يحمي الـ API باستخدام استراتيجية JWT
}