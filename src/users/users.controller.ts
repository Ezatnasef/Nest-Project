// في src/users/users.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from '../auth/dto/signup.dto'; // <-- 1. استدعي SignupDto الجديد
import { UpdateUserDto } from './dto/update-user.dto'; // (هذا افتراضي)

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() signupDto: SignupDto) { // <-- 2. غيّر الاسم هنا
    // سنعيد تسمية الدالة في السيرفيس لاحقاً
    return this.usersService.create(signupDto); 
  }
  
  // ... (باقي الدوال)
}