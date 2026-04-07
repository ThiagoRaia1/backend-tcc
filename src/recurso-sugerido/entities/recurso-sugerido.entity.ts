import { Etapa } from 'src/etapa/entities/etapa.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

type TipoRecurso = 'video' | 'artigo' | 'app' | 'livro';

@Entity()
export class RecursoSugerido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  link?: string;

  @Column({
    type: 'enum',
    enum: ['video', 'artigo', 'app', 'livro'],
    nullable: true,
  })
  tipo?: TipoRecurso;

  @ManyToOne(() => Etapa, (etapa) => etapa.recursosSugeridos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'etapaId' })
  etapa: Etapa;
}
