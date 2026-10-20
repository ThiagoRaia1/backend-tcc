import { Injectable } from '@nestjs/common';
import { CreateTentativaQuizDto } from './dto/create-tentativa-quiz.dto';
import { UpdateTentativaQuizDto } from './dto/update-tentativa-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TentativaQuiz } from './entities/tentativa-quiz.entity';
import { RespostaQuiz } from 'src/resposta-quiz/entities/resposta-quiz.entity';

@Injectable()
export class TentativaQuizService {
  constructor(
    @InjectRepository(TentativaQuiz)
    private readonly tentativaQuizRepository: Repository<TentativaQuiz>,

    @InjectRepository(RespostaQuiz)
    private readonly respostaQuizRepository: Repository<RespostaQuiz>,
  ) {}

  create(createTentativaQuizDto: CreateTentativaQuizDto) {
    return 'This action adds a new tentativaQuiz';
  }

  findAll() {
    return `This action returns all tentativaQuiz`;
  }

  async findOne(id: number) {
    return this.tentativaQuizRepository.findOne({
      where: { id },
      relations: {
        quiz: true,
        respostas: {
          questao: {
            alternativas: true,
          },
          alternativa: true,
        },
      },
    });
  }

  async findByQuiz(quizId: number) {
    return await this.tentativaQuizRepository.find({
      where: {
        quiz: { id: quizId },
      },
      relations: {
        quiz: true,
      },
      order: {
        finalizadoEm: 'DESC',
      },
    });
  }

  update(id: number, updateTentativaQuizDto: UpdateTentativaQuizDto) {
    return `This action updates a #${id} tentativaQuiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} tentativaQuiz`;
  }
}
