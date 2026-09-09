import { IsOptional, IsString } from 'class-validator';

export class AnotacaoDto {
  @IsString()
  plainText: string;

  @IsString()
  @IsOptional()
  editorState: string;
}
