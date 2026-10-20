import {
  IsArray,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RespostaQuizDto {
  @IsInt()
  @IsNotEmpty()
  questaoId: number;

  @IsInt()
  @IsNotEmpty()
  alternativaId: number;
}

export class FinalizarQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespostaQuizDto)
  respostas: RespostaQuizDto[];
}