import { Injectable } from '@nestjs/common';
import { CreateRespostaQuizDto } from './dto/create-resposta-quiz.dto';
import { UpdateRespostaQuizDto } from './dto/update-resposta-quiz.dto';

@Injectable()
export class RespostaQuizService {
  create(createRespostaQuizDto: CreateRespostaQuizDto) {
    return 'This action adds a new respostaQuiz';
  }

  findAll() {
    return `This action returns all respostaQuiz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} respostaQuiz`;
  }

  update(id: number, updateRespostaQuizDto: UpdateRespostaQuizDto) {
    return `This action updates a #${id} respostaQuiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} respostaQuiz`;
  }
}
