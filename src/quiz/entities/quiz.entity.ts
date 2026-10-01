import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Roadmap } from 'src/roadmap/entities/roadmap.entity';
import { Questao } from 'src/questao/entities/questao.entity';
import { TentativaQuiz } from 'src/tentativa-quiz/entities/tentativa-quiz.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { QuizEtapa } from 'src/quizEtapa/quizEtapa.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ default: 0 })
  quantidadeQuestoes: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.quizzes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ManyToOne(() => Roadmap, (roadmap) => roadmap.quizzes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roadmapId' })
  roadmap: Roadmap;

  @OneToMany(() => QuizEtapa, (quizEtapa) => quizEtapa.quiz, {
    cascade: true,
  })
  quizEtapas: QuizEtapa[];

  @OneToMany(() => Questao, (questao) => questao.quiz, {
    cascade: true,
    eager: true,
  })
  questoes: Questao[];

  @OneToMany(() => TentativaQuiz, (tentativa) => tentativa.quiz, {
    cascade: true,
    eager: true,
  })
  tentativas: TentativaQuiz[];
}
