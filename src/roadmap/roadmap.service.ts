import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { Roadmap } from './entities/roadmap.entity';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';

@Injectable()
export class RoadmapService {
  private client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  constructor(
    @InjectRepository(Roadmap)
    private roadmapRepository: Repository<Roadmap>,
  ) {}

  async create(createRoadmapDto: CreateRoadmapDto) {
  const { tema, usuarioId } = createRoadmapDto;

    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `
Você é um especialista em educação.

Retorne APENAS JSON válido.
Não use markdown.
Não inclua texto fora do JSON.
          `,
        },
        {
          role: 'user',
          content: `
Crie um roadmap completo para aprender ${tema}.

Formato obrigatório:

{
  "tema": "string",
  "nivel": "iniciante | intermediario | avancado",
  "duracao_estimada": "string",
  "descricao_geral": "string",
  "etapas": [
    {
      "ordem": number,
      "titulo": "string",
      "descricao": "string",
      "duracao": "string",
      "objetivos": ["string"],
      "recursos_sugeridos": ["string"]
    }
  ]
}
          `,
        },
      ],
    });

    const content = response.choices[0].message.content;

    let roadmapJson;

    try {
      roadmapJson = JSON.parse(content!);
    } catch (error) {
      throw new InternalServerErrorException('A IA retornou JSON inválido.');
    }

    const roadmap = this.roadmapRepository.create({
    ...roadmapJson,
    usuarioId, // 👈 AGORA vinculando ao usuário
  });

    return await this.roadmapRepository.save(roadmap);
  }

  async findAll() {
    return await this.roadmapRepository.find();
  }

  async findOne(id: number) {
    return await this.roadmapRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.roadmapRepository.delete(id);
  }
}
