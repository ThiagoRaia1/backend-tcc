import { PartialType } from '@nestjs/mapped-types';
import { CreateCadernoErroDto } from './create-caderno-erro.dto';

export class UpdateCadernoErroDto extends PartialType(CreateCadernoErroDto) {}
