import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

// 🚨 تصحيح المسارات النهائية (بناءً على الهيكل المتداخل) 🚨
import { JwtStrategy } from './strategy/jwt.strategy/jwt.strategy'; 
import { ApiKeyStrategy } from './strategy/jwt.strategy/api-key.strategy'; 
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard'; 
import { RolesGuard } from './guards/roles/roles.guard'; 

// 1. استدعاء خدمات الـ 2FA (الكنترولر والسيرفيس)
import { TwoFactorAuthenticationController } from './two-factor-authentication/two-factor-authentication.controller';
import { TwoFactorAuthenticationService } from './two-factor-authentication/two-factor-authentication.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [
    AuthController, 
    TwoFactorAuthenticationController, // ✅ إضافة Controller الـ 2FA
  ],
  providers: [
    AuthService,
    // تسجيل كل الـ Strategies والـ Guards
    JwtStrategy, 
    ApiKeyStrategy,
    JwtAuthGuard,
    RolesGuard,
    TwoFactorAuthenticationService, // ✅ إضافة Service الـ 2FA
  ],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule {}