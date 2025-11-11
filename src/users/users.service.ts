import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid'; // 🚨 (1) إضافة استدعاء UUID 🚨
import * as speakeasy from 'speakeasy'; // 🚨 (2) إضافة استدعاء speakeasy 🚨
import { User, UserRole } from './entities/user.entity';
import { SignupDto } from '../auth/dto/signup.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // =========================================================
  // 1. دوال الأمان (Authentication & API Key & 2FA)
  // =========================================================

  /**
   * ينشئ مستخدم جديد ويشفر كلمة المرور ويولد API Key.
   */
  async create(userDto: SignupDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    const user = this.usersRepository.create({
      email: userDto.email,
      firstName: userDto.firstName,
      lastName: userDto.lastName,

      password: hashedPassword,
      role: UserRole.USER,
      apiKey: uuid(), // توليد مفتاح API فريد
    });

    return await this.usersRepository.save(user);
  }

  /**
   * يتحقق من الباسورد لتسجيل الدخول.
   */
  async validateUserPassword(loginDto: LoginDto): Promise<User | null> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * دالة التحقق من الـ API Key.
   */
  async validateUserByApiKey(apiKey: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ apiKey });
    return user;
  }

  // 🚨 دوال الـ 2FA الجديدة 🚨

  /**
   * يولد المفتاح السري لـ 2FA ويحفظه مؤقتاً في الداتا بيز.
   */
  async generateTwoFactorSecret(user: User) {
    const secret = speakeasy.generateSecret({
        name: 'NestJS Spotify Clone',
        length: 20,
    });
    
    // حفظ المفتاح في الداتا بيز (يجب أن يتم تحديثه لاحقاً بالتفعيل)
    await this.usersRepository.update(user.id, {
        twoFactorSecret: secret.base32,
    });

    // نُرجع بيانات المفتاح وصورة الـ QR Code (لإرسالها لليوزر)
    return {
        secret: secret.base32,
        otpauthUrl: secret.otpauth_url,
    };
  }

  /**
   * يتحقق من كود الـ 2FA المرسل من اليوزر.
   */
  isTwoFactorCodeValid(twoFactorCode: string, user: User): boolean {
    return speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
    });
  }


  // =========================================================
  // 2. دوال الـ CRUD الأساسية
  // =========================================================

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}