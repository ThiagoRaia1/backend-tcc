import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TentativaQuiz } from 'src/tentativa-quiz/entities/tentativa-quiz.entity';
import { RespostaQuiz } from 'src/resposta-quiz/entities/resposta-quiz.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Roadmap } from 'src/roadmap/entities/roadmap.entity';
import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, TentativaQuiz, RespostaQuiz, Roadmap, Etapa, Usuario])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
