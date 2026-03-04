// create-roadmap.dto.ts
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateRoadmapDto {
  @IsString()
  tema: string;

  @Type(() => Number) // transforma string em number
  @IsNumber()
  usuarioId: number;
}
