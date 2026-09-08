import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEtapaDto } from './dto/create-etapa.dto';
import { UpdateEtapaDto } from './dto/update-etapa.dto';
import { UpdateAnotacaoDto } from './dto/update-anotacao.dto';
import { Etapa } from './entities/etapa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class EtapaService {
  constructor(
    @InjectRepository(Etapa)
    private etapaRepository: Repository<Etapa>,

    private readonly dataSource: DataSource,
  ) {}

  create(createEtapaDto: CreateEtapaDto) {
    return 'This action adds a new etapa';
  }

  findAll() {
    return `This action returns all etapa`;
  }

  async findOne(id: number) {
    return await this.etapaRepository.findOne({ where: { id } });
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

  async remove(id: number) {
    return await this.dataSource.transaction(async (manager) => {
      const etapaRepository = manager.getRepository(Etapa);

      const etapa = await etapaRepository.findOne({
        where: { id },
        relations: {
          roadmap: true,
        },
      });

      if (!etapa) {
        throw new NotFoundException('Etapa não encontrada.');
      }

      await etapaRepository.delete(id);

      await etapaRepository
        .createQueryBuilder()
        .update(Etapa)
        .set({
          ordem: () => `"ordem" - 1`,
        })
        .where(`"roadmapId" = :roadmapId`, {
          roadmapId: etapa.roadmap.id,
        })
        .andWhere(`"ordem" > :ordem`, {
          ordem: etapa.ordem,
        })
        .execute();

      return {
        message: 'Etapa excluída com sucesso.',
      };
    });
  }
}
