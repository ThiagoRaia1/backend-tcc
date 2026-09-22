import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Quiz } from './entities/quiz.entity';
import { Roadmap } from 'src/roadmap/entities/roadmap.entity';
import { Etapa } from 'src/etapa/entities/etapa.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Roadmap)
    private readonly roadmapRepository: Repository<Roadmap>,

    @InjectRepository(Etapa)
    private readonly etapaRepository: Repository<Etapa>,
  ) {}

  async create(createQuizDto: CreateQuizDto) {
    const { titulo, descricao, quantidadeQuestoes, etapaIds, roadmapId } =
      createQuizDto;

    const usuario = await this.usuarioRepository.findOne({
      where: {
        id: createQuizDto.usuarioId,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // 1. Verifica se o roadmap existe
    const roadmap = await this.roadmapRepository.findOne({
      where: {
        id: roadmapId,
      },
    });

    if (!roadmap) {
      throw new NotFoundException('Roadmap não encontrado.');
    }

    // 2. Busca as etapas selecionadas
    let etapas: Etapa[] = [];

    if (etapaIds && etapaIds.length > 0) {
      etapas = await this.etapaRepository.find({
        where: {
          id: In(etapaIds),
        },
        relations: {
          roadmap: true,
        },
      });

      // Verifica se todas as etapas existem
      if (etapas.length !== etapaIds.length) {
        throw new BadRequestException(
          'Uma ou mais etapas informadas não existem.',
        );
      }

      // 3. Verifica se todas as etapas pertencem ao roadmap
      const etapasDeOutroRoadmap = etapas.filter(
        (etapa) => etapa.roadmap?.id !== roadmapId,
      );

      if (etapasDeOutroRoadmap.length > 0) {
        throw new BadRequestException(
          'Uma ou mais etapas não pertencem ao roadmap informado.',
        );
      }
    }

    // 4. Cria o quiz
    const quiz = this.quizRepository.create({
      titulo,
      descricao: descricao ?? '',
      quantidadeQuestoes: quantidadeQuestoes ?? 0,
      roadmap,
      etapas,
      usuario,
    });

    // 5. Salva
    const quizSalvo = await this.quizRepository.save(quiz);

    return quizSalvo;
  }

  async findAll(usuarioId: number, roadmapId: number) {
    return this.quizRepository.find({
      where: {
        usuario: {
          id: usuarioId,
        },
        roadmap: {
          id: roadmapId,
        },
      },
      relations: {
        etapas: true,
        roadmap: true,
        questoes: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} quiz`;
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
