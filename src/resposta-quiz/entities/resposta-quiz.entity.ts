@Entity()
export class RespostaQuiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  correta: boolean;

  @ManyToOne(() => TentativaQuiz, (tentativa) => tentativa.respostas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tentativaId' })
  tentativa: TentativaQuiz;

  @ManyToOne(() => Questao, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questaoId' })
  questao: Questao;

  @ManyToOne(() => Alternativa, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'alternativaId' })
  alternativa: Alternativa;
}
