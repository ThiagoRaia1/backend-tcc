import { Module } from '@nestjs/common';
import { RecursoSugeridoService } from './recurso-sugerido.service';
import { RecursoSugeridoController } from './recurso-sugerido.controller';

@Module({
  controllers: [RecursoSugeridoController],
  providers: [RecursoSugeridoService],
})
export class RecursoSugeridoModule {}
