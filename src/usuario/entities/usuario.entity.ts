import { Roadmap } from 'src/roadmap/entities/roadmap.entity';
import { TentativaQuiz } from 'src/tentativa-quiz/entities/tentativa-quiz.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  nome: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Roadmap, (roadmap) => roadmap.usuario)
  roadmaps: Roadmap[];

  @OneToMany(() => TentativaQuiz, (tentativa) => tentativa.usuario)
  tentativasQuiz: TentativaQuiz[];
}
