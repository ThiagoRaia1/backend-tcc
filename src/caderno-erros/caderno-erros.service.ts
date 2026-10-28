import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RespostaQuiz } from 'src/resposta-quiz/entities/resposta-quiz.entity';

@Injectable()
export class CadernoErrosService {
  constructor(
    @InjectRepository(RespostaQuiz)
    private readonly respostaQuizRepository: Repository<RespostaQuiz>,
  ) {}

  async listarErros(
    usuarioId: number,
    roadmapId?: number,
  ): Promise<RespostaQuiz[]> {
    const query = this.respostaQuizRepository
      .createQueryBuilder('resposta')
      .innerJoinAndSelect('resposta.tentativa', 'tentativa')
      .innerJoin('tentativa.usuario', 'usuario')
      .innerJoinAndSelect('tentativa.quiz', 'quiz')
      .innerJoinAndSelect('resposta.questao', 'questao')
      .innerJoinAndSelect('questao.alternativas', 'alternativas')
      .leftJoinAndSelect('resposta.alternativa', 'alternativaEscolhida')
      .where('resposta.correta = :correta', { correta: false })
      .andWhere('usuario.id = :usuarioId', { usuarioId })
      .andWhere('tentativa.concluido = :concluido', {
        concluido: true,
      });

    if (roadmapId !== undefined) {
      query
        .innerJoin('quiz.roadmap', 'roadmap')
        .andWhere('roadmap.id = :roadmapId', { roadmapId });
    }

    return query
      .orderBy('tentativa.finalizadoEm', 'DESC')
      .addOrderBy('questao.ordem', 'ASC')
      .getMany();
  }
}
