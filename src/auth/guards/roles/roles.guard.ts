// src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. قراءة الصلاحيات المطلوبة من الميثود (الموجودة في @Roles())
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // 2. جلب بيانات اليوزر (التي تم وضعها في request.user بواسطة JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // 3. التحقق: هل صلاحية اليوزر ضمن الصلاحيات المطلوبة؟
    return requiredRoles.some((role) => user.role === role);
  }
}