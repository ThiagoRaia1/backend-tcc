import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto, SalvarRoadmapDto } from './dto/create-roadmap.dto';

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post()
  create(@Body() tema: CreateRoadmapDto) {
    return this.roadmapService.create(tema);
  }

  @Post('/salvar')
  salvar(@Body() createRoadmapDto: SalvarRoadmapDto) {
    return this.roadmapService.salvar(createRoadmapDto);
  }

  @Get('/usuario/:usuarioId')
  findAll(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.roadmapService.findAll(usuarioId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roadmapService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoadmapDto: any) {
    return this.roadmapService.update(id, updateRoadmapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roadmapService.remove(+id);
  }
}
