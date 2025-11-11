// src/artists/artists.service.ts

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  // 1. إنشاء فنان (Create)
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create(createArtistDto);
    return await this.artistRepository.save(artist);
  }

  // 2. جلب جميع الفنانين (Read All)
  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  // 3. جلب فنان محدد (Read One)
  async findOne(id: number): Promise<Artist> {
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations: ['songs'], // <--- لعرض أغاني الفنان
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    return artist;
  }

  // 4. تحديث فنان (Update)
  async update(id: number, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.preload({
      id: id,
      ...updateArtistDto,
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    return await this.artistRepository.save(artist);
  }

  // 5. حذف فنان (Delete)
  async remove(id: number): Promise<void> {
    const result = await this.artistRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    // لا نحتاج لإرجاع شيء
  }
}