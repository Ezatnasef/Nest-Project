// src/auth/strategy/api-key.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer'; 
import { UsersService } from '../../../users/users.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') { 
  constructor(private usersService: UsersService) {
    super();
  }

  // الـ apiKey هو المفتاح السري المرسل
  async validate(apiKey: string): Promise<any> {
    const user = await this.usersService.validateUserByApiKey(apiKey); 

    if (!user) {
      throw new UnauthorizedException(); 
    }
    return user; 
  }
}