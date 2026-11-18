import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { CadernoErrosService } from './caderno-erros.service';
import { FinalizarQuizDto } from 'src/quiz/dto/finalizar-quiz.dto';

@Controller('caderno-erros')
export class CadernoErrosController {
  constructor(
    private readonly cadernoErrosService: CadernoErrosService,
  ) {}

  @Get(':usuarioId')
  listarErros(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('roadmapId') roadmapId?: string,
  ) {
    const roadmapIdNumero = this.converterFiltro(roadmapId, 'roadmapId');

    return this.cadernoErrosService.listarErros(
      usuarioId,
      roadmapIdNumero,
    );
  }

  @Get(':usuarioId/praticar')
  gerarQuizPratica(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('roadmapId') roadmapId?: string,
  ) {
    const roadmapIdNumero = this.converterFiltro(roadmapId, 'roadmapId');

    return this.cadernoErrosService.gerarQuizPratica(
      usuarioId,
      roadmapIdNumero,
    );
  }

  @Post(':usuarioId/praticar/finalizar')
  finalizarQuizPratica(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Body() finalizarQuizDto: FinalizarQuizDto,
    @Query('roadmapId') roadmapId?: string,
  ) {
    const roadmapIdNumero = this.converterFiltro(roadmapId, 'roadmapId');

    return this.cadernoErrosService.finalizarQuizPratica(
      usuarioId,
      finalizarQuizDto,
      roadmapIdNumero,
    );
  }

  private converterFiltro(
    valor: string | undefined,
    nome: string,
  ): number | undefined {
    if (valor === undefined) {
      return undefined;
    }

    const numero = Number(valor);

    if (!Number.isInteger(numero) || numero <= 0) {
      throw new BadRequestException(
        `${nome} deve ser um número inteiro positivo.`,
      );
    }

    return numero;
  }
}