import { PartialType } from '@nestjs/mapped-types';
import { CreateRespostaQuizDto } from './create-resposta-quiz.dto';

export class UpdateRespostaQuizDto extends PartialType(CreateRespostaQuizDto) {}
