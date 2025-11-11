// المسار: src/artists/entities/artist.entity.ts

import { Song } from '../../songs/entities/song.entity'; // <-- تأكد من المسار (العودة لـ src ثم الدخول لـ songs)
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Song, (song) => song.artist)
  songs: Song[];
}