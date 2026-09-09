import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateObjetivoDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  anotacao?: string;

  @IsBoolean()
  @IsOptional()
  concluido?: boolean;
}
