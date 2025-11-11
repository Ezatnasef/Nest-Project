// src/artists/dto/create-artist.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}