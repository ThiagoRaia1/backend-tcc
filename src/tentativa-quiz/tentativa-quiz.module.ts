import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TentativaQuizService } from './tentativa-quiz.service';
import { TentativaQuizController } from './tentativa-quiz.controller';
import { TentativaQuiz } from './entities/tentativa-quiz.entity';
import { RespostaQuiz } from 'src/resposta-quiz/entities/resposta-quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TentativaQuiz, RespostaQuiz])],
  controllers: [TentativaQuizController],
  providers: [TentativaQuizService],
  exports: [TentativaQuizService],
})
export class TentativaQuizModule {}
