import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from '../dto/create-song.dto';

// 🚨 Security & Custom Imports
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Host } from '../common/decorators/host.decorator';
import { PaginationQueryDTO } from '../common/dto/pagination-query.dto';

// 🚨 Swagger Imports
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Songs') // 1. تصنيف كل الروابط تحت "Songs"
@ApiBearerAuth() // 2. تعليم الكنترولر بأنه يتطلب JWT
@Controller('songs')
@UseGuards(JwtAuthGuard) // حماية كل الروابط في الكنترولر
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UseGuards(RolesGuard) // 3. تفعيل حارس الصلاحيات
  @Roles(UserRole.ARTIST) // 4. الصلاحية المطلوبة
  async create(@Body() createSongDto: CreateSongDTO) {
    return this.songsService.create(createSongDto);
  }

  @Get()
  findAll(@Host() host: string, @Query() paginationQuery: PaginationQueryDTO) {
    console.log('Request is from host:', host);
    return this.songsService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.songsService.findOne(id);
  }
}