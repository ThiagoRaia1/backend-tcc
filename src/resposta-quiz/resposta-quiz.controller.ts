import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RespostaQuizService } from './resposta-quiz.service';
import { CreateRespostaQuizDto } from './dto/create-resposta-quiz.dto';
import { UpdateRespostaQuizDto } from './dto/update-resposta-quiz.dto';

@Controller('resposta-quiz')
export class RespostaQuizController {
  constructor(private readonly respostaQuizService: RespostaQuizService) {}

  @Post()
  create(@Body() createRespostaQuizDto: CreateRespostaQuizDto) {
    return this.respostaQuizService.create(createRespostaQuizDto);
  }

  @Get()
  findAll() {
    return this.respostaQuizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.respostaQuizService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRespostaQuizDto: UpdateRespostaQuizDto) {
    return this.respostaQuizService.update(+id, updateRespostaQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.respostaQuizService.remove(+id);
  }
}
