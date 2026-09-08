import { Module } from '@nestjs/common';
import { ReferenciasService } from './referencias.service';
import { ReferenciasController } from './referencias.controller';
import { Referencia } from './entities/referencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Referencia])],
  controllers: [ReferenciasController],
  providers: [ReferenciasService],
})
export class ReferenciasModule {}
