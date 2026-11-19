import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Card } from './entities/card.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Objetivo } from 'src/objetivo/entities/objetivo.entity';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Etapa)
    private readonly etapaRepository: Repository<Etapa>,

    @InjectRepository(Objetivo)
    private readonly objetivoRepository: Repository<Objetivo>,
  ) {}

  async create(createCardDto: CreateCardDto) {
    const { pergunta, resposta, usuarioId, etapaId, objetivoId } =
      createCardDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    let etapa: Etapa;
    let objetivo: Objetivo | null = null;

    if (objetivoId) {
      const objetivoEncontrado = await this.objetivoRepository.findOne({
        where: { id: objetivoId },
        relations: ['etapa'],
      });

      if (!objetivoEncontrado) {
        throw new NotFoundException('Objetivo não encontrado.');
      }

      objetivo = objetivoEncontrado;
      etapa = objetivoEncontrado.etapa;
    } else if (etapaId) {
      const etapaEncontrada = await this.etapaRepository.findOne({
        where: { id: etapaId },
      });

      if (!etapaEncontrada) {
        throw new NotFoundException('Etapa não encontrada.');
      }

      etapa = etapaEncontrada;
    } else {
      throw new BadRequestException(
        'É necessário informar uma etapa ou um objetivo.',
      );
    }

    const card = this.cardRepository.create({
      pergunta,
      resposta,
      usuario,
      etapa,
      objetivo,
    });

    return this.cardRepository.save(card);
  }

  async findAll() {
    return this.cardRepository.find({
      relations: ['usuario', 'etapa', 'objetivo'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['usuario', 'etapa', 'objetivo'],
    });

    if (!card) {
      throw new NotFoundException('Card não encontrado.');
    }

    return card;
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    const card = await this.findOne(id);

    const { pergunta, resposta, etapaId, objetivoId } = updateCardDto;

    if (pergunta !== undefined) card.pergunta = pergunta;
    if (resposta !== undefined) card.resposta = resposta;

    if (objetivoId !== undefined) {
      if (objetivoId === null) {
        card.objetivo = null;
      } else {
        const objetivo = await this.objetivoRepository.findOne({
          where: { id: objetivoId },
          relations: ['etapa'],
        });

        if (!objetivo) {
          throw new NotFoundException('Objetivo não encontrado.');
        }

        card.objetivo = objetivo;
        card.etapa = objetivo.etapa;
      }
    } else if (etapaId !== undefined) {
      const etapa = await this.etapaRepository.findOne({
        where: { id: etapaId },
      });

      if (!etapa) {
        throw new NotFoundException('Etapa não encontrada.');
      }

      card.etapa = etapa;
      card.objetivo = null;
    }

    return this.cardRepository.save(card);
  }

  async remove(id: number) {
    const card = await this.findOne(id);

    await this.cardRepository.remove(card);

    return {
      mensagem: 'Card removido com sucesso.',
    };
  }
}
