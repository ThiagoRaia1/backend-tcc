import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateEtapaDto } from 'src/etapa/dto/create-etapa.dto';

export class CreateRoadmapDto {
  @IsString()
  tema: string;
}

export class SalvarRoadmapDto {
  @IsString()
  tema: string;

  @IsString()
  descricaoGeral: string;

  @IsString()
  duracaoEstimada: string;

  @IsString()
  nivel: 'iniciante' | 'intermediario' | 'avancado';

  @IsNumber()
  usuarioId: number;

  @IsOptional()
  @IsNumber()
  porcentagemConclusao?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEtapaDto)
  etapas: CreateEtapaDto[];
}
