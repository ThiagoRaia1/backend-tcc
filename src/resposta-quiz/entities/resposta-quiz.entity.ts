import { Alternativa } from 'src/alternativa/entities/alternativa.entity';
import { Questao } from 'src/questao/entities/questao.entity';
import { TentativaQuiz } from 'src/tentativa-quiz/entities/tentativa-quiz.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class RespostaQuiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  correta: boolean;

  @ManyToOne(() => TentativaQuiz, (tentativa) => tentativa.respostas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tentativaId' })
  tentativa: TentativaQuiz;

  @ManyToOne(() => Questao, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questaoId' })
  questao: Questao;

  @ManyToOne(() => Alternativa, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'alternativaId' })
  alternativa: Alternativa;
}
