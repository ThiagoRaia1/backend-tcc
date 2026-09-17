import { Questao } from 'src/questao/entities/questao.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Alternativa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  texto: string;

  @Column({ default: false })
  correta: boolean;

  @Column({ type: 'int' })
  ordem: number;

  @ManyToOne(() => Questao, (questao) => questao.alternativas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questaoId' })
  questao: Questao;
}
