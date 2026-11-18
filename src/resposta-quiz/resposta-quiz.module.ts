import { Module } from '@nestjs/common';
import { RespostaQuizService } from './resposta-quiz.service';
import { RespostaQuizController } from './resposta-quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespostaQuiz } from './entities/resposta-quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RespostaQuiz])],
  controllers: [RespostaQuizController],
  providers: [RespostaQuizService],
})
export class RespostaQuizModule {}
