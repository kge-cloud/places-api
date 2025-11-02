import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class QueryPlacesDto {
  @IsString()
  city: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
