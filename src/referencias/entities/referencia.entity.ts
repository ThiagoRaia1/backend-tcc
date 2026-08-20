import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Objetivo } from 'src/objetivo/entities/objetivo.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

type TipoRecurso = 'Artigo' | 'Livro' | 'Notícia' | 'Site' | 'Vídeo' | 'Outro';

@Entity()
export class Referencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['Artigo', 'Livro', 'Notícia', 'Site', 'Vídeo', 'Outro'],
    nullable: true,
  })
  tipo?: TipoRecurso;

  @Column()
  nome: string;

  @Column({ nullable: true })
  url?: string;

  @ManyToOne(() => Etapa, (etapa) => etapa.referencias, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'etapaId' })
  etapa: Etapa;

  @ManyToOne(() => Objetivo, (objetivo) => objetivo.referencias, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'objetivoId' })
  objetivo: Objetivo;
}
