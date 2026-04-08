import { IsOptional, IsString } from 'class-validator';

export class UpdateAnotacaoDto {
  @IsOptional()
  @IsString()
  plainText?: string;

  @IsOptional()
  @IsString()
  editorState?: string;
}
