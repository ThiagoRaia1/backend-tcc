import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';
import { Referencia } from './entities/referencia.entity';
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

  async update(id: number, updateReferenciaDto: UpdateReferenciaDto) {
    const referencia = await this.referenciaRepository.findOne({
      where: { id },
    });

    if (!referencia) {
      throw new NotFoundException('Referencia não encontrada.');
    }

    // Mescla os dados antigos com os novos
    Object.assign(referencia, updateReferenciaDto);

    const referenciaAtualizada =
      await this.referenciaRepository.save(referencia);

    return referenciaAtualizada;
  }

  async remove(id: number) {
    return await this.referenciaRepository.delete(id);
  }
}
