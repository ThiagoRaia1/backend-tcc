import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  pergunta: string;

  @IsString()
  resposta: string;

  @IsNumber()
  usuarioId: number;

  @IsNumber()
  @IsOptional()
  etapaId?: number;

  @IsNumber()
  @IsOptional()
  objetivoId?: number;
}
