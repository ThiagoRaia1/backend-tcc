import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

type TipoRecurso = 'Artigo' | 'Livro' | 'Notícia' | 'Site' | 'Vídeo' | 'Outro';

export class CreateReferenciaDto {
  @IsEnum(['Artigo', 'Livro', 'Notícia', 'Site', 'Vídeo', 'Outro'])
  @IsOptional()
  tipo?: TipoRecurso;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  etapaId?: number;

  @IsOptional()
  objetivoId?: number;
}
