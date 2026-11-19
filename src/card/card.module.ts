import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardService } from './card.service';
import { CardController } from './card.controller';

import { Card } from './entities/card.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Etapa } from 'src/etapa/entities/etapa.entity';
import { Objetivo } from 'src/objetivo/entities/objetivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Usuario, Etapa, Objetivo])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
