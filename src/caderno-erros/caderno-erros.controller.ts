import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { CadernoErrosService } from './caderno-erros.service';

@Controller('caderno-erros')
export class CadernoErrosController {
  constructor(private readonly cadernoErrosService: CadernoErrosService) {}

  @Get(':usuarioId')
  listarErros(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('roadmapId') roadmapId?: string,
  ) {
    const roadmapIdNumero = this.converterFiltro(roadmapId, 'roadmapId');

    return this.cadernoErrosService.listarErros(usuarioId, roadmapIdNumero);
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
