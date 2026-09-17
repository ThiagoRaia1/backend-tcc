import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Questao } from 'src/questao/entities/questao.entity';
import { TentativaQuiz } from 'src/tentativa-quiz/entities/tentativa-quiz.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ default: 0 })
  quantidadeQuestoes: number;

  @ManyToOne(() => Etapa, (etapa) => etapa.quizzes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'etapaId' })
  etapa: Etapa;

  @OneToMany(() => Questao, (questao) => questao.quiz, {
    cascade: true,
    eager: true,
  })
  questoes: Questao[];

  @OneToMany(() => TentativaQuiz, (tentativa) => tentativa.quiz)
  tentativas: TentativaQuiz[];
}
