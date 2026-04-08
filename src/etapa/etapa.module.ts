import { Module } from '@nestjs/common';
import { EtapaService } from './etapa.service';
import { EtapaController } from './etapa.controller';
import { Etapa } from './entities/etapa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Etapa])],
  controllers: [EtapaController],
  providers: [EtapaService],
})
export class EtapaModule {}
