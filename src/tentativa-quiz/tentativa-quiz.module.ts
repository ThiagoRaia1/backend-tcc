import { Module } from '@nestjs/common';
import { TentativaQuizService } from './tentativa-quiz.service';
import { TentativaQuizController } from './tentativa-quiz.controller';

@Module({
  controllers: [TentativaQuizController],
  providers: [TentativaQuizService],
})
export class TentativaQuizModule {}
