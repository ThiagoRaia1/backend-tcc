import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateObjetivoDto } from 'src/objetivo/dto/create-objetivo.dto';
import { AnotacaoDto } from './anotacao.dto';

export class CreateEtapaDto {
  @IsString()
  titulo: string;

  @IsNumber()
  ordem: number;

  @IsString()
  descricao: string;

  @IsString()
  duracao: string;

  @IsBoolean()
  concluido: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateObjetivoDto)
  objetivos: CreateObjetivoDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => AnotacaoDto)
  anotacoes?: AnotacaoDto;
}
