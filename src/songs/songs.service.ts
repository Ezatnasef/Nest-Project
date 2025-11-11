import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSongDTO } from '../dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { PaginationQueryDTO } from '../common/dto/pagination-query.dto'; // <-- تأكد من وجود نقطتين فقط (..)

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
  ) {}

  async create(createSongDto: CreateSongDTO) {
    const song = this.songsRepository.create(createSongDto);
    return await this.songsRepository.save(song);
  }

  // 1. دالة findAll تستقبل DTO وتستخدم skip/take
  findAll(paginationQuery: PaginationQueryDTO) {
    return this.songsRepository.find({
      skip: paginationQuery.offset,
      take: paginationQuery.limit,
    });
  }

  async findOne(id: number) {
    const song = await this.songsRepository.findOneBy({ id: id });
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    return song;
  }
}