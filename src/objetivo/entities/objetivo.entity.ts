import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Referencia } from 'src/referencias/entities/referencia.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Objetivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  descricao: string;

  @Column({ default: false })
  concluido: boolean;

  @ManyToOne(() => Etapa, (etapa) => etapa.objetivos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  etapa: Etapa;

  @OneToMany(() => Referencia, (referencia) => referencia.objetivo, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  referencias: Referencia[];
}
