// src/users/dto/update-user.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    // 🚨 إضافة الحقل المطلوب لتحديث حالة الـ 2FA
    @IsBoolean()
    @IsOptional()
    isTwoFactorEnabled?: boolean;

    @IsString()
    @IsOptional()
    twoFactorSecret?: string;
}
