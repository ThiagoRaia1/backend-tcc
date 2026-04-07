import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjetivoService } from './objetivo.service';
import { CreateObjetivoDto } from './dto/create-objetivo.dto';
import { UpdateObjetivoDto } from './dto/update-objetivo.dto';

@Controller('objetivo')
export class ObjetivoController {
  constructor(private readonly objetivoService: ObjetivoService) {}

  @Post()
  create(@Body() createObjetivoDto: CreateObjetivoDto) {
    return this.objetivoService.create(createObjetivoDto);
  }

  @Get()
  findAll() {
    return this.objetivoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objetivoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateObjetivoDto: UpdateObjetivoDto) {
    return this.objetivoService.update(+id, updateObjetivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.objetivoService.remove(+id);
  }
}
