import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ArtistsModule } from './artists/artists.module';
import { UsersModule } from './users/users.module'; // 1. إضافة موديول المستخدمين
import { AuthModule } from './auth/auth.module'; // 2. إضافة موديول المصادقة

@Module({
  imports: [
    // 3. قراءة ملف .env (يجب أن يكون أول شيء)
    ConfigModule.forRoot({ isGlobal: true }),
    
    DatabaseModule, // 4. الاتصال بالداتا بيز
    
    // الموديولات الوظيفية
    SongsModule,
    ArtistsModule,
    
    // موديولات الأمان
    UsersModule, 
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('songs');
  }
}