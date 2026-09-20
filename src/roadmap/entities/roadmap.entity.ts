import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tema: string;

  @Column()
  descricaoGeral: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.roadmaps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  usuario: Usuario;

  @OneToMany(() => Etapa, (etapa) => etapa.roadmap, {
    cascade: true,
    eager: true,
  })
  etapas: Etapa[];

  @OneToMany(() => Quiz, (quiz) => quiz.roadmap, {
    cascade: true,
    eager: true,
  })
  quizzes: Quiz[];
}
