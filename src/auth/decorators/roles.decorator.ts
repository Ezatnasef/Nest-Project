// src/auth/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity'; // <-- نستدعي الـ Enum

// هذا Decorator يتيح لنا تحديد الصلاحيات المطلوبة فوق الـ Controller أو الدوال
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);