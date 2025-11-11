// src/artists/artists.module.ts

import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity'; // 1. استدعي الـ Entity

@Module({
  // 2. سجل الـ Entity هنا لتجهيز الـ Repository
  imports: [TypeOrmModule.forFeature([Artist])], 
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}