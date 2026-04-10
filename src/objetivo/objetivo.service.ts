import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateObjetivoDto } from './dto/create-objetivo.dto';
import { UpdateObjetivoDto } from './dto/update-objetivo.dto';
import { Objetivo } from './entities/objetivo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ObjetivoService {
  constructor(
    @InjectRepository(Objetivo)
    private objetivoRepository: Repository<Objetivo>,
  ) {}

  create(createObjetivoDto: CreateObjetivoDto) {
    return 'This action adds a new objetivo';
  }

  findAll() {
    return `This action returns all objetivo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} objetivo`;
  }

  async update(id: number, updateObjetivoDto: UpdateObjetivoDto) {
    const objetivo = await this.objetivoRepository.findOne({ where: { id } });

    if (!objetivo) {
      throw new NotFoundException('Objetivo não encontrado.');
    }

    // Mescla os dados antigos com os novos
    Object.assign(objetivo, updateObjetivoDto);

    const objetivoAtualizado = await this.objetivoRepository.save(objetivo);

    return objetivoAtualizado;
  }

  remove(id: number) {
    return `This action removes a #${id} objetivo`;
  }
}
