import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import OpenAI from 'openai';
import { Questao } from 'src/questao/entities/questao.entity';
import { QuizEtapa } from 'src/quizEtapa/quizEtapa.entity';
import { TentativaQuiz } from 'src/tentativa-quiz/entities/tentativa-quiz.entity';
import { RespostaQuiz } from 'src/resposta-quiz/entities/resposta-quiz.entity';
import { FinalizarQuizDto } from './dto/finalizar-quiz.dto';

@Injectable()
export class QuizService {
  private client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Roadmap)
    private readonly roadmapRepository: Repository<Roadmap>,

    @InjectRepository(Etapa)
    private readonly etapaRepository: Repository<Etapa>,

    @InjectRepository(QuizEtapa)
    private readonly quizEtapaRepository: Repository<QuizEtapa>,

    @InjectRepository(TentativaQuiz)
    private readonly tentativaQuizRepository: Repository<TentativaQuiz>,

    @InjectRepository(RespostaQuiz)
    private readonly respostaQuizRepository: Repository<RespostaQuiz>,
  ) {}

  private async gerarQuestoesDaEtapa(etapa: Etapa, quantidadeQuestoes: number) {
    const conteudoEtapa = {
      id: etapa.id,
      titulo: etapa.titulo,
      descricao: etapa.descricao,

      objetivos: etapa.objetivos?.map((objetivo) => ({
        titulo: objetivo.titulo,
        descricao: objetivo.descricao,
      })),
    };

    const response = await this.client.chat.completions.create({
      model: 'openai/gpt-oss-20b',

      temperature: 0.4,

      response_format: {
        type: 'json_schema',

        json_schema: {
          name: 'questoes_quiz',

          strict: true,

          schema: {
            type: 'object',

            additionalProperties: false,

            properties: {
              questoes: {
                type: 'array',

                items: {
                  type: 'object',

                  additionalProperties: false,

                  properties: {
                    enunciado: {
                      type: 'string',
                    },

                    alternativas: {
                      type: 'array',

                      items: {
                        type: 'object',

                        additionalProperties: false,

                        properties: {
                          texto: {
                            type: 'string',
                          },

                          correta: {
                            type: 'boolean',
                          },

                          ordem: {
                            type: 'integer',
                          },
                        },

                        required: ['texto', 'correta', 'ordem'],
                      },
                    },
                  },

                  required: ['enunciado', 'alternativas'],
                },
              },
            },

            required: ['questoes'],
          },
        },
      },

      messages: [
        {
          role: 'system',

          content: `
Você é um especialista em educação e criação de avaliações.

Crie questões de múltipla escolha baseadas EXCLUSIVAMENTE
no conteúdo da etapa fornecida.

REGRAS:

- Crie exatamente ${quantidadeQuestoes} questões.
- Cada questão deve possuir exatamente 4 alternativas.
- Cada questão deve possuir exatamente uma alternativa correta.
- As outras 3 alternativas devem possuir "correta": false.
- As questões devem avaliar a compreensão do conteúdo.
- Não crie questões sobre assuntos que não estejam presentes na etapa.
- Não repita questões.
- Não repita alternativas dentro da mesma questão.
- Não use Markdown.
- Não adicione propriedades extras.
- Retorne somente o JSON definido pelo schema.
`,
        },

        {
          role: 'user',

          content: `
Crie ${quantidadeQuestoes} questões para esta etapa:

${JSON.stringify(conteudoEtapa, null, 2)}
`,
        },
      ],
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new InternalServerErrorException(
        `A IA não retornou questões para a etapa ${etapa.id}.`,
      );
    }

    try {
      const resultado = JSON.parse(content);

      return resultado.questoes.map((questao) => ({
        ...questao,
        etapaId: etapa.id,
      }));
    } catch (error) {
      console.error(`JSON inválido para a etapa ${etapa.id}:`, content);

      throw new InternalServerErrorException(
        `A IA retornou JSON inválido para a etapa ${etapa.id}.`,
      );
    }
  }

  async gerarQuiz(createQuizDto: CreateQuizDto) {
    const { roadmapId, etapaIds } = createQuizDto;

    const QUESTOES_POR_ETAPA = 5;

    const roadmap = await this.roadmapRepository.findOne({
      where: {
        id: roadmapId,
      },
    });

    if (!roadmap) {
      throw new NotFoundException('Roadmap não encontrado.');
    }

    if (!etapaIds || etapaIds.length === 0) {
      throw new BadRequestException('Nenhuma etapa informada.');
    }

    const etapas = await this.etapaRepository.find({
      where: {
        id: In(etapaIds),
      },
      relations: {
        roadmap: true,
        objetivos: true,
      },
      order: {
        ordem: 'ASC',
      },
    });

    if (etapas.length !== etapaIds.length) {
      throw new BadRequestException(
        'Uma ou mais etapas informadas não existem.',
      );
    }

    const etapasDeOutroRoadmap = etapas.filter(
      (etapa) => etapa.roadmap?.id !== roadmapId,
    );

    if (etapasDeOutroRoadmap.length > 0) {
      throw new BadRequestException(
        'Uma ou mais etapas não pertencem ao roadmap informado.',
      );
    }

    const questoesGeradas: Questao[] = [];

    let ordemGlobal = 1;

    for (const etapa of etapas) {
      const questoes = await this.gerarQuestoesDaEtapa(
        etapa,
        QUESTOES_POR_ETAPA,
      );

      for (const questao of questoes) {
        questoesGeradas.push({
          ...questao,
          ordem: ordemGlobal,
        });

        ordemGlobal++;
      }
    }

    return await this.create({
      ...createQuizDto,
      quantidadeQuestoes: questoesGeradas.length,
      questoes: questoesGeradas,
    });
  }

  async create(createQuizDto: CreateQuizDto) {
    const {
      titulo,
      descricao,
      etapaIds,
      roadmapId,
      questoes,
      quantidadeQuestoes,
    } = createQuizDto;

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

      // Verifica se pertencem ao roadmap
      const etapasDeOutroRoadmap = etapas.filter(
        (etapa) => etapa.roadmap?.id !== roadmapId,
      );

      if (etapasDeOutroRoadmap.length > 0) {
        throw new BadRequestException(
          'Uma ou mais etapas não pertencem ao roadmap informado.',
        );
      }
    }

    const quiz = this.quizRepository.create({
      titulo,
      descricao: descricao ?? '',
      quantidadeQuestoes: questoes ? questoes.length : 0,
      roadmap,
      questoes,
      usuario,
    });

    const quizSalvo = await this.quizRepository.save(quiz);

    if (etapas.length > 0) {
      const quizEtapas = etapas.map((etapa) =>
        this.quizEtapaRepository.create({
          quiz: quizSalvo,
          etapa,
        }),
      );

      await this.quizEtapaRepository.save(quizEtapas);
    }

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
        quizEtapas: {
          etapa: true,
        },
        questoes: true,
        tentativas: true,
      },
    });
  }

  async findOne(id: number) {
    return this.quizRepository.findOne({
      where: {
        id,
      },
      relations: {
        quizEtapas: {
          etapa: true,
        },
        questoes: true,
        tentativas: true,
      },
    });
  }

  async finalizarQuiz(quizId: number, finalizarQuizDto: FinalizarQuizDto) {
    const { respostas } = finalizarQuizDto;

    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: {
        questoes: {
          alternativas: true,
        },
        usuario: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz não encontrado.');
    }

    if (!respostas || respostas.length === 0) {
      throw new BadRequestException('Nenhuma resposta foi enviada.');
    }

    if (respostas.length !== quiz.questoes.length) {
      throw new BadRequestException(
        `O quiz possui ${quiz.questoes.length} questões, mas foram enviadas ${respostas.length} respostas.`,
      );
    }

    let acertos = 0;

    const respostasParaSalvar: RespostaQuiz[] = [];

    for (const resposta of respostas) {
      const questao = quiz.questoes.find((q) => q.id === resposta.questaoId);

      if (!questao) {
        throw new BadRequestException(
          `A questão ${resposta.questaoId} não pertence a este quiz.`,
        );
      }

      const alternativa = questao.alternativas.find(
        (a) => a.id === resposta.alternativaId,
      );

      if (!alternativa) {
        throw new BadRequestException(
          `A alternativa ${resposta.alternativaId} não pertence à questão ${questao.id}.`,
        );
      }

      const correta = alternativa.correta;

      if (correta) {
        acertos++;
      }

      respostasParaSalvar.push(
        this.respostaQuizRepository.create({
          correta,
          questao,
          alternativa,
        }),
      );
    }

    const totalQuestoes = quiz.questoes.length;

    const percentual =
      totalQuestoes > 0
        ? Number(((acertos / totalQuestoes) * 100).toFixed(2))
        : 0;

    const tentativa = this.tentativaQuizRepository.create({
      pontuacao: acertos,
      totalQuestoes,
      percentual,
      concluido: true,
      finalizadoEm: new Date(),
      usuario: quiz.usuario,
      quiz,
    });

    const tentativaSalva = await this.tentativaQuizRepository.save(tentativa);

    for (const resposta of respostasParaSalvar) {
      resposta.tentativa = tentativaSalva;
    }

    await this.respostaQuizRepository.save(respostasParaSalvar);

    return this.tentativaQuizRepository.findOne({
      where: {
        id: tentativaSalva.id,
      },
      relations: {
        quiz: true,
        respostas: {
          questao: true,
          alternativa: true,
        },
      },
    });
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: {
        questoes: {
          alternativas: true,
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz não encontrado.');
    }

    // Atualiza o título e a descrição
    if (updateQuizDto.titulo !== undefined) {
      quiz.titulo = updateQuizDto.titulo;
    }

    if (updateQuizDto.descricao !== undefined) {
      quiz.descricao = updateQuizDto.descricao;
    }

    // Estrutura recebida pelo frontend
    const dados = updateQuizDto as UpdateQuizDto & {
      questoes?: {
        id: number;
        enunciado: string;
        alternativas: {
          id: number;
          texto: string;
          correta: boolean;
          ordem: number;
        }[];
      }[];
    };

    if (dados.questoes) {
      for (const questaoDto of dados.questoes) {
        const questao = quiz.questoes.find((item) => item.id === questaoDto.id);

        if (!questao) {
          throw new BadRequestException(
            `A questão ${questaoDto.id} não pertence a este quiz.`,
          );
        }

        questao.enunciado = questaoDto.enunciado;

        for (const alternativaDto of questaoDto.alternativas ?? []) {
          const alternativa = questao.alternativas.find(
            (item) => item.id === alternativaDto.id,
          );

          if (!alternativa) {
            throw new BadRequestException(
              `A alternativa ${alternativaDto.id} não pertence à questão ${questao.id}.`,
            );
          }

          alternativa.texto = alternativaDto.texto;
          alternativa.correta = alternativaDto.correta;
          alternativa.ordem = alternativaDto.ordem;
        }
      }

      quiz.quantidadeQuestoes = quiz.questoes.length;
    }

    return await this.quizRepository.save(quiz);
  }

  async remove(id: number) {
    return await this.quizRepository.delete(id);
  }
}
