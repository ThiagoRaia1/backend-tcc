import { IsString } from 'class-validator';

export class AnotacaoDto {
  @IsString()
  plainText: string;

  @IsString()
  editorState: string;
}
