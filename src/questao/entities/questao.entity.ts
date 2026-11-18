import { Alternativa } from '../../alternativa/entities/alternativa.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Questao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  enunciado: string;

  @Column({ type: 'int' })
  ordem: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @OneToMany(() => Alternativa, (alternativa) => alternativa.questao, {
    cascade: true,
    eager: true,
  })
  alternativas: Alternativa[];
}
