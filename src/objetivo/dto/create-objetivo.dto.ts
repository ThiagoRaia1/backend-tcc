import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateObjetivoDto {
  @IsString()
  descricao: string;

  @IsBoolean()
  @IsOptional()
  concluido?: boolean;
}
