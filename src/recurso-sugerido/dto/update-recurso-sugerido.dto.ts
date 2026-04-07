import { PartialType } from '@nestjs/mapped-types';
import { CreateRecursoSugeridoDto } from './create-recurso-sugerido.dto';

export class UpdateRecursoSugeridoDto extends PartialType(CreateRecursoSugeridoDto) {}
