// المسار: src/common/dto/pagination-query.dto.ts
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationQueryDTO {
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit: number = 10; // قيمة افتراضية

  @IsNumber()
  @IsOptional()
  @Min(0)
  offset: number = 0; // قيمة افتراضية
}