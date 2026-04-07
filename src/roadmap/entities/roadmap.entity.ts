import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

type Nivel = 'iniciante' | 'intermediario' | 'avancado';

@Entity()
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tema: string;

  @Column()
  descricaoGeral: string;

  @Column()
  duracaoEstimada: string;

  @Column({
    type: 'enum',
    enum: ['iniciante', 'intermediario', 'avancado'],
  })
  nivel: Nivel;

  @ManyToOne(() => Usuario, (usuario) => usuario.roadmaps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column({ default: 0 })
  porcentagemConclusao: number;

  @OneToMany(() => Etapa, (etapa) => etapa.roadmap, {
    cascade: true,
    eager: true,
  })
  etapas: Etapa[];
}
