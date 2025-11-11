// src/dto/create-song.dto.ts

import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateSongDTO {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsInt() // <-- الفنان هو رقم (ID)
  @IsNotEmpty()
  readonly artistId: number; // <-- ضفنا الفنان
}