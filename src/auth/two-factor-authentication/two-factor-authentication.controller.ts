import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  HttpCode,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service'; // <--- (سنفترض وجوده)
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Controller('auth/2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    // يجب إنشاء هذا Service يدوياً أو بـ CLI
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService, 
  ) {}

  // 1. [POST /auth/2fa/generate]: توليد QR Code (الخطوة الأولى للتفعيل)
  //   محمي بـ JWT (المستخدم لازم يكون مسجل دخوله عشان يطلب ده)
  @Post('generate')
  @UseGuards(JwtAuthGuard) 
  async register(@Req() req) {
    const user = req.user; // بيانات اليوزر من التوكن (من الـ JwtStrategy)
    
    // الدالة دي بتولد المفتاح و URL الباركود
    const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorSecret(user);
    
    // بترجع الـ QR Code كصورة base64 عشان يعرضها اليوزر في الفرونت إند
  return this.twoFactorAuthenticationService.pipeQrCodeStream(otpauthUrl!); 
  }

  // 2. [POST /auth/2fa/turn-on]: تأكيد التفعيل (الخطوة الأخيرة)
  //    اليوزر بيبعت كود الـ Authenticator عشان نأكد تفعيل الميزة
  @Post('turn-on')
  @HttpCode(200) // ليرجع 200 بدلاً من 201
  @UseGuards(JwtAuthGuard)
  async turnOn(@Req() req, @Body() body: { twoFactorCode: string }) {
    const user = req.user;
    
    // 1. تحقق من صحة الكود
    const isCodeValid = this.usersService.isTwoFactorCodeValid(body.twoFactorCode, user);
    
    if (!isCodeValid) {
      // لو الكود غلط، نرفض التفعيل
      return 'Invalid authentication code';
    }
    
    // 2. لو صح، نحدّث حالة isTwoFactorEnabled في الداتا بيز
    await this.usersService.update(user.id, { isTwoFactorEnabled: true });
    return 'Two-factor authentication successfully enabled';
  }

  // 3. [POST /auth/2fa/authenticate]: خطوة التحقق أثناء تسجيل الدخول
  //    دي الخطوة الإضافية اللي بتيجي بعد ما اليوزر يدخل إيميل وباسورد صح
  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard) // ممكن يكون ليها Guard خاص أو يتم التعامل مع التوكن بشكل مختلف
  async authenticate(@Req() req, @Body() body: { twoFactorCode: string }) {
    const user = req.user;

    // 1. تحقق من الكود
    const isCodeValid = this.usersService.isTwoFactorCodeValid(body.twoFactorCode, user);

    if (!isCodeValid) {
      return 'Invalid authentication code';
    }

    // 2. لو صح، نرجع توكن جديد وسليم (لإكمال تسجيل الدخول)
    return this.authService.login(user); // نفترض أن AuthService لديه دالة login تستقبل كائن User
  }
}