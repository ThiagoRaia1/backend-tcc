import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Objetivo } from 'src/objetivo/entities/objetivo.entity';

import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  pergunta: string;

  @Column({ type: 'text' })
  resposta: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.cards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  usuario: Usuario;

  @ManyToOne(() => Etapa, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  etapa: Etapa;

  @ManyToOne(() => Objetivo, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  objetivo: Objetivo | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
