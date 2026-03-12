import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  senhaAtual?: string;

  @IsString()
  @IsOptional()
  novaSenha?: string;

  @IsOptional()
  @IsString()
  confirmarNovaSenha?: string;
}
