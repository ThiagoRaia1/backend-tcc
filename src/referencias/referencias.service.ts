import { Injectable } from '@nestjs/common';
import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';
import { Referencia } from './entities/referencia.entity';
import { create } from 'domain';
import { async } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReferenciasService {
  constructor(
    @InjectRepository(Referencia)
    private referenciaRepository: Repository<Referencia>,
  ) {}

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

  async remove(id: number) {
    return await this.referenciaRepository.delete(id);
  }
}
