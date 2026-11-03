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

  async gerarQuizPratica(usuarioId: number, roadmapId?: number) {
    const erros = await this.listarErros(usuarioId, roadmapId);

    const quizzesAgrupados = new Map<
      number,
      {
        quizId: number;
        titulo: string;
        questoes: Map<
          number,
          {
            id: number;
            enunciado: string;
            ordem: number;
            quantidadeErros: number;
            alternativas: {
              id: number;
              texto: string;
              ordem: number;
              correta: boolean;
            }[];
          }
        >;
      }
    >();

    for (const erro of erros) {
      const quiz = erro.tentativa.quiz;
      const questao = erro.questao;

      if (!quizzesAgrupados.has(quiz.id)) {
        quizzesAgrupados.set(quiz.id, {
          quizId: quiz.id,
          titulo: quiz.titulo,
          questoes: new Map(),
        });
      }

      const quizAgrupado = quizzesAgrupados.get(quiz.id)!;

      if (!quizAgrupado.questoes.has(questao.id)) {
        quizAgrupado.questoes.set(questao.id, {
          id: questao.id,
          enunciado: questao.enunciado,
          ordem: questao.ordem,
          quantidadeErros: 0,
          alternativas: questao.alternativas.map((alternativa) => ({
            id: alternativa.id,
            texto: alternativa.texto,
            ordem: alternativa.ordem,
            correta: alternativa.correta,
          })),
        });
      }

      quizAgrupado.questoes.get(questao.id)!.quantidadeErros++;
    }

    const quizzes = Array.from(quizzesAgrupados.values()).map((quiz) => {
      const questoes = Array.from(quiz.questoes.values())
        .sort(
          (a, b) =>
            b.quantidadeErros - a.quantidadeErros ||
            a.ordem - b.ordem,
        )
        .slice(0, 3);

      return {
        quizOrigem: {
          id: quiz.quizId,
          titulo: quiz.titulo,
        },
        questoes,
      };
    });

    const quizzesComQuestoes = quizzes.filter(
      (quiz) => quiz.questoes.length > 0,
    );

    return {
      titulo: 'Prática de erros',
      totalQuestoes: quizzesComQuestoes.reduce(
        (total, quiz) => total + quiz.questoes.length,
        0,
      ),
      quizzes: quizzesComQuestoes,
      questoes: quizzesComQuestoes.flatMap((quiz) =>
        quiz.questoes.map((questao) => ({
          ...questao,
          quizOrigem: quiz.quizOrigem,
        })),
      ),
    };
  }
}