import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecursoSugeridoService } from './recurso-sugerido.service';
import { CreateRecursoSugeridoDto } from './dto/create-recurso-sugerido.dto';
import { UpdateRecursoSugeridoDto } from './dto/update-recurso-sugerido.dto';

@Controller('recurso-sugerido')
export class RecursoSugeridoController {
  constructor(private readonly recursoSugeridoService: RecursoSugeridoService) {}

  @Post()
  create(@Body() createRecursoSugeridoDto: CreateRecursoSugeridoDto) {
    return this.recursoSugeridoService.create(createRecursoSugeridoDto);
  }

  @Get()
  findAll() {
    return this.recursoSugeridoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recursoSugeridoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecursoSugeridoDto: UpdateRecursoSugeridoDto) {
    return this.recursoSugeridoService.update(+id, updateRecursoSugeridoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recursoSugeridoService.remove(+id);
  }
}
