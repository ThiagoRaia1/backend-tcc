import { Injectable } from '@nestjs/common';
import { CreateRecursoSugeridoDto } from './dto/create-recurso-sugerido.dto';
import { UpdateRecursoSugeridoDto } from './dto/update-recurso-sugerido.dto';

@Injectable()
export class RecursoSugeridoService {
  create(createRecursoSugeridoDto: CreateRecursoSugeridoDto) {
    return 'This action adds a new recursoSugerido';
  }

  findAll() {
    return `This action returns all recursoSugerido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recursoSugerido`;
  }

  update(id: number, updateRecursoSugeridoDto: UpdateRecursoSugeridoDto) {
    return `This action updates a #${id} recursoSugerido`;
  }

  remove(id: number) {
    return `This action removes a #${id} recursoSugerido`;
  }
}
