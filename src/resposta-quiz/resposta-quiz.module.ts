import { Module } from '@nestjs/common';
import { RespostaQuizService } from './resposta-quiz.service';
import { RespostaQuizController } from './resposta-quiz.controller';

@Module({
  controllers: [RespostaQuizController],
  providers: [RespostaQuizService],
})
export class RespostaQuizModule {}
