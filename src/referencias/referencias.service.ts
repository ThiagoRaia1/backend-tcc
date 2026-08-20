import { Injectable } from '@nestjs/common';
import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';

@Injectable()
export class ReferenciasService {
  create(createReferenciaDto: CreateReferenciaDto) {
    return 'This action adds a new referencia';
  }

  findAll() {
    return `This action returns all referencias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} referencia`;
  }

  update(id: number, updateReferenciaDto: UpdateReferenciaDto) {
    return `This action updates a #${id} referencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} referencia`;
  }
}
