import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { Roadmap } from './entities/roadmap.entity';
import { CreateRoadmapDto, SalvarRoadmapDto } from './dto/create-roadmap.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class RoadmapService {
  private client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  constructor(
    @InjectRepository(Roadmap)
    private roadmapRepository: Repository<Roadmap>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createRoadmapDto: CreateRoadmapDto) {
    const { tema } = createRoadmapDto;

    const response = await this.client.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      temperature: 0.6,

      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'roadmap',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              tema: {
                type: 'string',
              },

              descricaoGeral: {
                type: 'string',
              },

              etapas: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    titulo: {
                      type: 'string',
                    },

                    ordem: {
                      type: 'integer',
                    },

                    descricao: {
                      type: 'string',
                    },

                    concluido: {
                      type: 'boolean',
                    },

                    objetivos: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          titulo: {
                            type: 'string',
                          },

                          descricao: {
                            type: 'string',
                          },

                          concluido: {
                            type: 'boolean',
                          },
                        },
                        required: ['titulo', 'descricao', 'concluido'],
                      },
                    },
                  },

                  required: [
                    'titulo',
                    'ordem',
                    'descricao',
                    'concluido',
                    'objetivos',
                  ],
                },
              },
            },

            required: ['tema', 'descricaoGeral', 'etapas'],
          },
        },
      },

      messages: [
        {
          role: 'system',
          content: `
Você é um especialista em educação.

Crie um roadmap de estudos sobre o tema informado pelo usuário.

Retorne SOMENTE um objeto JSON válido.
Não use Markdown.
Não use blocos de código.
Não escreva nenhum texto antes ou depois do JSON.

O JSON deve seguir exatamente esta estrutura:

{
  "tema": "string",
  "descricaoGeral": "string",
  "etapas": [
    {
      "titulo": "string",
      "ordem": 1,
      "descricao": "string",
      "concluido": false,
      "objetivos": [
        {
          "titulo": "string",
          "descricao": "string",
          "concluido": false
        }
      ]
    }
  ]
}

Regras:

- "tema" deve ser uma string.
- "descricaoGeral" deve ser uma string.
- "etapas" deve ser um array.
- Cada etapa deve possuir "titulo", "ordem", "descricao", "concluido" e "objetivos".
- "ordem" deve ser um número inteiro.
- A primeira etapa deve possuir ordem 1.
- Crie entre 6 e 10 etapas.
- As ordens seguintes devem ser sequenciais: 2, 3, 4...
- "concluido" deve ser sempre false.
- "objetivos" deve ser um array.
- Cada objetivo deve possuir "titulo", "descricao" e "concluido".
- Não adicione propriedades extras.
      `,
        },
        {
          role: 'user',
          content: `Crie um roadmap completo para aprender ${tema}.`,
        },
      ],
    });

    const content = response.choices[0].message.content;

    console.log('========== RESPOSTA DA IA ==========');
    console.log(content);
    console.log('====================================');

    if (!content) {
      throw new InternalServerErrorException('A IA não retornou conteúdo.');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('========== JSON INVÁLIDO ==========');
      console.error(content);
      console.error('==================================');

      throw new InternalServerErrorException('A IA retornou JSON inválido.');
    }
  }

  async salvar(salvarRoadmapDto: SalvarRoadmapDto) {
    const usuarioLogado = await this.usuarioRepository.findOne({
      where: {
        id: salvarRoadmapDto.usuario,
      },
    });

    if (!usuarioLogado) return;

    const roadmapCriado = this.roadmapRepository.create({
      tema: salvarRoadmapDto.tema,
      descricaoGeral: salvarRoadmapDto.descricaoGeral,
      usuario: usuarioLogado,
      etapas: salvarRoadmapDto.etapas,
    });

    return await this.roadmapRepository.save(roadmapCriado);
  }

  async findAll(usuarioId: number) {
    const roadmaps = await this.roadmapRepository.find({
      where: {
        usuario: {
          id: usuarioId,
        },
      },
    });

    return roadmaps;
  }

  async findOne(id: number) {
    return await this.roadmapRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRoadmapDto: Partial<SalvarRoadmapDto>) {
    const roadmap = await this.roadmapRepository.findOne({
      where: { id },
      relations: ['usuario'], // opcional (se precisar)
    });

    if (!roadmap) {
      throw new NotFoundException('Roadmap não encontrado.');
    }

    // Mescla os dados antigos com os novos
    Object.assign(roadmap, updateRoadmapDto);

    const roadmapAtualizado = await this.roadmapRepository.save(roadmap);

    return roadmapAtualizado;
  }

  async remove(id: number) {
    return await this.roadmapRepository.delete(id);
  }
}
