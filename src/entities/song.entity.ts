import { Artist } from '../artists/artist.entity'; // 1. استدعي الفنان
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'; // 2. ضيف ManyToOne

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // 3. "الأغاني الكتير" تنتمي لـ "فنان واحد"
  @ManyToOne(() => Artist, (artist) => artist.songs, { nullable: false })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;
}
