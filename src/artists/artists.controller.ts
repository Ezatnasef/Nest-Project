import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

// 🚨 تصحيح المسار (Path) لـ ApiKeyGuard
// (نقطتين للخلف للخروج من artists/، ثم الدخول لـ auth/guards)
import { ApiKeyGuard } from '../auth/guards/api-key/api-key.guard';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  // 💡 ملاحظة: يُفضل استخدام حماية JWT هنا، حيث أن الـ POST ليس طلبًا عامًا
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  @UseGuards(ApiKeyGuard) // ✅ تطبيق الحماية باستخدام API Key
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  // ✅ تطبيق ParseIntPipe لتحويل الـ ID
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.artistsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.artistsService.remove(id);
  }
}