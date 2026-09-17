import { Injectable } from '@nestjs/common';
import { CreateTentativaQuizDto } from './dto/create-tentativa-quiz.dto';
import { UpdateTentativaQuizDto } from './dto/update-tentativa-quiz.dto';

@Injectable()
export class TentativaQuizService {
  create(createTentativaQuizDto: CreateTentativaQuizDto) {
    return 'This action adds a new tentativaQuiz';
  }

  findAll() {
    return `This action returns all tentativaQuiz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tentativaQuiz`;
  }

  update(id: number, updateTentativaQuizDto: UpdateTentativaQuizDto) {
    return `This action updates a #${id} tentativaQuiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} tentativaQuiz`;
  }
}
