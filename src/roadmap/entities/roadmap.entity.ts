// roadmap.entity.ts
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tema: string;

  @Column()
  nivel: string;

  @Column()
  duracao_estimada: string;

  @Column({ type: 'text' })
  descricao_geral: string;

  @Column({ type: 'json' })
  etapas: any;

  @ManyToOne(() => Usuario, (usuario) => usuario.roadmaps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column()
  usuarioId: number;
}
