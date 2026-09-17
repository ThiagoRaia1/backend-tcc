import { PartialType } from '@nestjs/mapped-types';
import { CreateTentativaQuizDto } from './create-tentativa-quiz.dto';

export class UpdateTentativaQuizDto extends PartialType(CreateTentativaQuizDto) {}
