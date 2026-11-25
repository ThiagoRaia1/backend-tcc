import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateObjetivoDto } from './dto/create-objetivo.dto';
import { UpdateObjetivoDto } from './dto/update-objetivo.dto';
import { Objetivo } from './entities/objetivo.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ObjetivoService {
  constructor(
    @InjectRepository(Objetivo)
    private objetivoRepository: Repository<Objetivo>,

    private readonly dataSource: DataSource,
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

  async remove(id: number) {
    return await this.dataSource.transaction(async (manager) => {
      const objetivoRepository = manager.getRepository(Objetivo);

      const objetivo = await objetivoRepository.findOne({
        where: { id },
        relations: {
          etapa: true,
        },
      });

      if (!objetivo) {
        throw new NotFoundException('Objetivo não encontrado.');
      }

      // Exclui o objetivo
      await objetivoRepository.delete(id);

      // Reorganiza a ordem dos objetivos restantes da mesma etapa
      await objetivoRepository
        .createQueryBuilder()
        .update(Objetivo)
        .set({
          ordem: () => '"ordem" - 1',
        })
        .where('"etapaId" = :etapaId', {
          etapaId: objetivo.etapa.id,
        })
        .andWhere('"ordem" > :ordem', {
          ordem: objetivo.ordem,
        })
        .execute();

      return {
        message: 'Objetivo excluído com sucesso.',
      };
    });
  }
}
