import { IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateRecursoSugeridoDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsIn(['video', 'artigo', 'app', 'livro'])
  tipo?: 'video' | 'artigo' | 'app' | "livro";
}
