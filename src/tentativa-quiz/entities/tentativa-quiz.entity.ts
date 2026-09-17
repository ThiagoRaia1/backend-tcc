import { Quiz } from 'src/quiz/entities/quiz.entity';
import { RespostaQuiz } from 'src/resposta-quiz/entities/resposta-quiz.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class TentativaQuiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pontuacao: number;

  @Column()
  totalQuestoes: number;

  @Column({ default: 0 })
  percentual: number;

  @Column({ default: false })
  concluido: boolean;

  @CreateDateColumn()
  iniciadoEm: Date;

  @Column({ type: 'timestamp', nullable: true })
  finalizadoEm: Date | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.tentativasQuiz, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ManyToOne(() => Quiz, (quiz) => quiz.tentativas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @OneToMany(() => RespostaQuiz, (resposta) => resposta.tentativa, {
    cascade: true,
  })
  respostas: RespostaQuiz[];
}
