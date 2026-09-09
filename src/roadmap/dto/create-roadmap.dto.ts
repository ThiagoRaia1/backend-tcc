import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export class CreateRoadmapDto {
  @IsString()
  tema: string;
}

export class SalvarRoadmapDto {
  @IsString()
  tema: string;

  @IsString()
  @IsOptional()
  descricaoGeral?: string;

  @IsInt()
  @IsNotEmpty()
  usuario: number;

  @IsOptional()
  etapas?: Etapa[];
}
