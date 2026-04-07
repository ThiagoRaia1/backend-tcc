import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import OpenAI from 'openai';
import { Roadmap } from './entities/roadmap.entity';
import { CreateRoadmapDto, SalvarRoadmapDto } from './dto/create-roadmap.dto';
import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Objetivo } from 'src/objetivo/entities/objetivo.entity';
import { CreateEtapaDto } from 'src/etapa/dto/create-etapa.dto';
import { CreateObjetivoDto } from 'src/objetivo/dto/create-objetivo.dto';
import { CreateRecursoSugeridoDto } from 'src/recurso-sugerido/dto/create-recurso-sugerido.dto';
import { RecursoSugerido } from 'src/recurso-sugerido/entities/recurso-sugerido.entity';
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

Formato obrigatório (JSON válido):

{
  "tema": "${tema}",
  "nivel": "iniciante | intermediario | avancado",
  "duracaoEstimada": "string",
  "descricaoGeral": "string",
  "etapas": [
    {
      "ordem": number,
      "titulo": "string",
      "descricao": "string",
      "duracao": "string",
      "concluido": false,
      "objetivos": [
        { "descricao": "string", "concluido": false }
      ],
      "recursosSugeridos": [
        { "titulo": "string", "link": "url" (optional), "tipo": "video" | "artigo" | "app" | "livro" }
      ],
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

    console.log(roadmapJson.etapas[0].objetivos[0]);

    return roadmapJson;
  }

  async salvar(salvarRoadmapDto: SalvarRoadmapDto) {
    const usuariologado: Usuario | null = await this.usuarioRepository.findOne({
      where: { id: salvarRoadmapDto.usuarioId },
    });

    if (!usuariologado) return;

    const roadmapCriado = this.roadmapRepository.create({
      ...salvarRoadmapDto,
      usuario: usuariologado,
    });
    const roadmapSalvo = await this.roadmapRepository.save(roadmapCriado);
    
    return roadmapSalvo;
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
