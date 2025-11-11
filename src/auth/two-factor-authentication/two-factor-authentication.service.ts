// src/auth/two-factor-authentication/two-factor-authentication.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as speakeasy from 'speakeasy'; // استدعاء المكتبة
import * as qrcode from 'qrcode'; // استدعاء مكتبة QR Code
import { User } from '../../users/entities/user.entity';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  // 1. توليد المفتاح السري وصورة الـ QR Code
  async generateTwoFactorSecret(user: User) {
    // نستخدم speakeasy لتوليد المفتاح
    const secret = speakeasy.generateSecret({
      name: `NestJS App (${user.email})`,
      length: 20,
    });

    // تحديث قاعدة البيانات بالمفتاح السري
    await this.usersService.update(user.id, {
      twoFactorSecret: secret.base32,
    });

    // توليد الـ QR Code URL
    const otpauthUrl = secret.otpauth_url; 

    return {
      secret: secret.base32,
      otpauthUrl: otpauthUrl,
    };
  }

  // 2. تحويل الـ URL إلى صورة Base64
  async pipeQrCodeStream(otpauthUrl: string): Promise<string> {
    return qrcode.toDataURL(otpauthUrl);
  }

  // 3. دالة التحقق من الكود (Verification)
  isTwoFactorCodeValid(twoFactorCode: string, user: User): boolean {
    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorCode,
    });
  }
}