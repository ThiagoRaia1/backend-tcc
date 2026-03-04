import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { Roadmap } from './entities/roadmap.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Roadmap])],
  controllers: [RoadmapController],
  providers: [RoadmapService],
})
export class RoadmapModule {}
