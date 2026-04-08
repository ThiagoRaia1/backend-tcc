import { Objetivo } from 'src/objetivo/entities/objetivo.entity';
import { RecursoSugerido } from 'src/recurso-sugerido/entities/recurso-sugerido.entity';
import { Roadmap } from 'src/roadmap/entities/roadmap.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Etapa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  ordem: number;

  @Column()
  descricao: string;

  @Column()
  duracao: string;

  @Column()
  concluido: boolean;

  @Column({ type: 'json', nullable: true })
  anotacoes: {
    plainText: string;
    editorState: string | null;
  };

  @ManyToOne(() => Roadmap, (roadmap) => roadmap.etapas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  roadmap: Roadmap;

  @OneToMany(() => Objetivo, (objetivo) => objetivo.etapa, {
    cascade: true,
    eager: true,
  })
  objetivos: Objetivo[];

  @OneToMany(
    () => RecursoSugerido,
    (recursoSugeridos) => recursoSugeridos.etapa,
    {
      cascade: true,
      eager: true,
    },
  )
  recursosSugeridos: RecursoSugerido[];
}
