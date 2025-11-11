// src/artists/entities/artist.entity.ts

import { Song } from '../songs/entities/song.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // الحقل المطلوب في الـ POST

  @OneToMany(() => Song, (song) => song.artist)
  songs: Song[];
}