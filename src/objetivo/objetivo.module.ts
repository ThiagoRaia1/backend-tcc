import { Module } from '@nestjs/common';
import { ObjetivoService } from './objetivo.service';
import { ObjetivoController } from './objetivo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objetivo } from './entities/objetivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Objetivo])],
  controllers: [ObjetivoController],
  providers: [ObjetivoService],
})
export class ObjetivoModule {}
