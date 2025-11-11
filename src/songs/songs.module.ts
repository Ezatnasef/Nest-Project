import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. استدعي TypeOrm
import { Song } from './entities/song.entity'; // 2. استدعي الـ Entity
import { AuthModule } from '../auth/auth.module'; // 4. استدعي AuthModule عشان تستخدم JwtAuthGuard

@Module({
  // 3. ضيف السطر ده عشان تعمل "Inject" للـ Repository
  imports: [TypeOrmModule.forFeature([Song]), AuthModule], // 5. ضيف AuthModule هنا
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}