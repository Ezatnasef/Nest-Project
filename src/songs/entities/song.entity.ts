import { Artist } from '../../artists/artist.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // 2. "الأغنية الواحدة" عندها "فنان واحد"
  @ManyToOne(() => Artist, (artist) => artist.songs, { nullable: false })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;
}
