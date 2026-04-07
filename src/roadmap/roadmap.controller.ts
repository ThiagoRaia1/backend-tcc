import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto, SalvarRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post()
  create(@Body() tema: CreateRoadmapDto) {
    return this.roadmapService.create(tema);
  }

  @Post('/salvar')
  salvar(@Body() createRoadmapDto: SalvarRoadmapDto) {
    console.log("Entrou no controller do salvar")
    return this.roadmapService.salvar(createRoadmapDto);
  }

  @Get()
  findAll() {
    return this.roadmapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roadmapService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoadmapDto: UpdateRoadmapDto) {
  //   return this.roadmapService.update(+id, updateRoadmapDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roadmapService.remove(+id);
  }
}
