import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReferenciasService } from './referencias.service';
import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';

@Controller('referencias')
export class ReferenciasController {
  constructor(private readonly referenciasService: ReferenciasService) {}

  @Post()
  create(@Body() createReferenciaDto: CreateReferenciaDto) {
    return this.referenciasService.create(createReferenciaDto);
  }

  @Get()
  findAll() {
    return this.referenciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referenciasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReferenciaDto: UpdateReferenciaDto) {
    return this.referenciasService.update(+id, updateReferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referenciasService.remove(+id);
  }
}
