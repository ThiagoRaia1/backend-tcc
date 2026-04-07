import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { Roadmap } from './entities/roadmap.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Objetivo } from 'src/objetivo/entities/objetivo.entity';
import { RecursoSugerido } from 'src/recurso-sugerido/entities/recurso-sugerido.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roadmap, Etapa, Objetivo, RecursoSugerido, Usuario]),
  ],
  controllers: [RoadmapController],
  providers: [RoadmapService],
})
export class RoadmapModule {}
