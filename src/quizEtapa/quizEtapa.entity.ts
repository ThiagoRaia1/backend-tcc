import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Quiz } from 'src/quiz/entities/quiz.entity';
import { Etapa } from 'src/etapa/entities/etapa.entity';

@Entity()
export class QuizEtapa {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizEtapas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @ManyToOne(() => Etapa, (etapa) => etapa.quizEtapas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'etapaId' })
  etapa: Etapa;
}
