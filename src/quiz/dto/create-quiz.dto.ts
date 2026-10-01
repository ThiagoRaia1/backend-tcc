import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Questao } from 'src/questao/entities/questao.entity';

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;
  
  @IsInt()
  @IsOptional()
  quantidadeQuestoes?: number;

  // Quiz associado a uma ou mais etapas
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  etapaIds?: number[];

  // Quiz associado diretamente a um roadmap
  @IsOptional()
  @IsInt()
  @Min(1)
  roadmapId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  usuarioId?: number;

  @IsOptional()
  questoes?: Questao[];
}
