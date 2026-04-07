import { Etapa } from 'src/etapa/entities/etapa.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Objetivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column({ default: false })
  concluido: boolean;

  @ManyToOne(() => Etapa, (etapa) => etapa.objetivos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  etapa: Etapa;
}
