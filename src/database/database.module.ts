// المسار: src/database/database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        
        // 🚨 هذا هو السطر الحاسم الذي يجب أن تتأكد منه 🚨
        // يجب أن يشمل كل المجلدات: songs و artists
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], 
        
        synchronize: false, // يجب أن تكون false الآن
      }),
    }),
  ],
})
export class DatabaseModule {}