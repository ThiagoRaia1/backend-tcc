import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RespostaQuiz } from 'src/resposta-quiz/entities/resposta-quiz.entity';
import { FinalizarQuizDto } from 'src/quiz/dto/finalizar-quiz.dto';

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
          (a, b) => b.quantidadeErros - a.quantidadeErros || a.ordem - b.ordem,
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

  async finalizarQuizPratica(
    usuarioId: number,
    finalizarQuizDto: FinalizarQuizDto,
    roadmapId?: number,
  ) {
    // Busca o histórico de erros do usuário.
    // Aqui usamos listarErros diretamente para manter acesso
    // à propriedade "correta" das alternativas no backend.
    const erros = await this.listarErros(usuarioId, roadmapId);

    if (!erros.length) {
      throw new BadRequestException(
        'Não existem erros disponíveis para praticar.',
      );
    }

    // Agrupa as questões por quiz de origem.
    const grupos = new Map<
      number,
      {
        quizOrigem: { id: number; titulo: string };
        questoes: Map<number, { questao: any; quantidadeErros: number }>;
      }
    >();

    for (const erro of erros) {
      const quiz = erro.tentativa.quiz;
      const questao = erro.questao;

      if (!grupos.has(quiz.id)) {
        grupos.set(quiz.id, {
          quizOrigem: {
            id: quiz.id,
            titulo: quiz.titulo,
          },
          questoes: new Map(),
        });
      }

      const grupo = grupos.get(quiz.id)!;
      const questaoExistente = grupo.questoes.get(questao.id);

      if (questaoExistente) {
        questaoExistente.quantidadeErros++;
      } else {
        grupo.questoes.set(questao.id, {
          questao,
          quantidadeErros: 1,
        });
      }
    }

    // Seleciona até 3 questões com mais erros de cada quiz.
    // Em caso de empate, utiliza a ordem original da questão.
    const questoesSelecionadas = Array.from(grupos.values()).flatMap(
      (grupo) => {
        const questoes = Array.from(grupo.questoes.values())
          .sort(
            (a, b) =>
              b.quantidadeErros - a.quantidadeErros ||
              a.questao.ordem - b.questao.ordem,
          )
          .slice(0, 3);

        return questoes.map(({ questao }) => ({
          ...questao,
          quizOrigem: grupo.quizOrigem,
        }));
      },
    );

    if (!questoesSelecionadas.length) {
      throw new BadRequestException(
        'Não foi possível gerar questões para praticar.',
      );
    }

    const respostasRecebidas = finalizarQuizDto.respostas;

    if (
      !Array.isArray(respostasRecebidas) ||
      respostasRecebidas.length !== questoesSelecionadas.length
    ) {
      throw new BadRequestException(
        'Você deve responder todas as questões da prática.',
      );
    }

    // Impede que uma questão seja respondida mais de uma vez.
    const idsRecebidos = respostasRecebidas.map(
      (resposta) => resposta.questaoId,
    );

    if (new Set(idsRecebidos).size !== idsRecebidos.length) {
      throw new BadRequestException(
        'Não é permitido enviar respostas duplicadas.',
      );
    }

    let acertos = 0;

    const respostasCorrigidas = questoesSelecionadas.map((questao) => {
      const respostaRecebida = respostasRecebidas.find(
        (resposta) => resposta.questaoId === questao.id,
      );

      if (!respostaRecebida) {
        throw new BadRequestException(
          `A questão ${questao.id} não foi respondida.`,
        );
      }

      const alternativaSelecionada = questao.alternativas.find(
        (alternativa) => alternativa.id === respostaRecebida.alternativaId,
      );

      if (!alternativaSelecionada) {
        throw new BadRequestException(
          `Alternativa inválida para a questão ${questao.id}.`,
        );
      }

      const correta = alternativaSelecionada.correta === true;

      if (correta) {
        acertos++;
      }

      return {
        id: questao.id,
        correta,
        questao: {
          ...questao,
          alternativas: questao.alternativas,
        },
        alternativa: alternativaSelecionada,
      };
    });

    const totalQuestoes = questoesSelecionadas.length;
    const percentual = (acertos / totalQuestoes) * 100;

    // Retorna um resultado temporário, sem persistir no banco.
    return {
      id: null,
      pontuacao: acertos,
      totalQuestoes,
      percentual,
      concluido: true,
      finalizadoEm: new Date(),
      quiz: {
        titulo: 'Prática de erros',
      },
      respostas: respostasCorrigidas,
    };
  }
}
