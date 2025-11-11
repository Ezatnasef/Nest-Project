// src/auth/guards/api-key.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// يستخدم اسم الاستراتيجية الذي عرفناه في ApiKeyStrategy
@Injectable()
export class ApiKeyGuard extends AuthGuard('api-key') {}