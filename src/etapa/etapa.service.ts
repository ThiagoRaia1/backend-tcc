import { Injectable } from '@nestjs/common';
import { CreateEtapaDto } from './dto/create-etapa.dto';
import { UpdateEtapaDto } from './dto/update-etapa.dto';
import { UpdateAnotacaoDto } from './dto/update-anotacao.dto';
import { Etapa } from './entities/etapa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EtapaService {
  constructor(
    @InjectRepository(Etapa)
    private etapaRepository: Repository<Etapa>,
  ) {}

  create(createEtapaDto: CreateEtapaDto) {
    return 'This action adds a new etapa';
  }

  findAll() {
    return `This action returns all etapa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} etapa`;
  }

  update(id: number, updateEtapaDto: UpdateEtapaDto) {
    return `This action updates a #${id} etapa`;
  }

  async updateAnotacao(id: number, dto: UpdateAnotacaoDto) {
    const etapa = await this.etapaRepository.findOneBy({ id });

    if (!etapa) {
      throw new Error('Etapa não encontrada');
    }

    const atual = etapa.anotacoes || {
      plainText: '',
      editorState: null,
    };

    etapa.anotacoes = {
      plainText: dto.plainText ?? atual.plainText,
      editorState: dto.editorState ?? atual.editorState,
    };

    return this.etapaRepository.save(etapa);
  }

  remove(id: number) {
    return `This action removes a #${id} etapa`;
  }
}
