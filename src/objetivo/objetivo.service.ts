import { Injectable } from '@nestjs/common';
import { CreateObjetivoDto } from './dto/create-objetivo.dto';
import { UpdateObjetivoDto } from './dto/update-objetivo.dto';

@Injectable()
export class ObjetivoService {
  create(createObjetivoDto: CreateObjetivoDto) {
    return 'This action adds a new objetivo';
  }

  findAll() {
    return `This action returns all objetivo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} objetivo`;
  }

  update(id: number, updateObjetivoDto: UpdateObjetivoDto) {
    return `This action updates a #${id} objetivo`;
  }

  remove(id: number) {
    return `This action removes a #${id} objetivo`;
  }
}
