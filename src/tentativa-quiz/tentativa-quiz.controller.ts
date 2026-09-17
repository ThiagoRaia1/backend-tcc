import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TentativaQuizService } from './tentativa-quiz.service';
import { CreateTentativaQuizDto } from './dto/create-tentativa-quiz.dto';
import { UpdateTentativaQuizDto } from './dto/update-tentativa-quiz.dto';

@Controller('tentativa-quiz')
export class TentativaQuizController {
  constructor(private readonly tentativaQuizService: TentativaQuizService) {}

  @Post()
  create(@Body() createTentativaQuizDto: CreateTentativaQuizDto) {
    return this.tentativaQuizService.create(createTentativaQuizDto);
  }

  @Get()
  findAll() {
    return this.tentativaQuizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tentativaQuizService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTentativaQuizDto: UpdateTentativaQuizDto) {
    return this.tentativaQuizService.update(+id, updateTentativaQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tentativaQuizService.remove(+id);
  }
}
