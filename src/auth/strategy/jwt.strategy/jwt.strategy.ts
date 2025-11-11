// src/auth/strategy/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../../users/entities/user.entity'; // تأكد من المسار
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // يقرأ التوكن من Authorization: Bearer <token>
      ignoreExpiration: false, // لا يتجاهل انتهاء صلاحية التوكن
      secretOrKey: configService.get('JWT_SECRET') || 'defaultSecret', // المفتاح السري من .env
    });
  }

  // هذه الدالة تنفذ بعد التحقق من صلاحية التوكن
  async validate(payload: { sub: number; email: string }) {
    // هنا يمكنك جلب بيانات اليوزر من الداتا بيز (اختياري)
    const user = await this.usersRepository.findOneBy({ id: payload.sub });
    if (!user) {
        // يمكنك رمي خطأ Unauthorized هنا لو لم يتم العثور على اليوزر
    }
    return user; // بيانات اليوزر يتم وضعها في request.user
  }
}