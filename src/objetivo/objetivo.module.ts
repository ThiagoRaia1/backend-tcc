import { Module } from '@nestjs/common';
import { ObjetivoService } from './objetivo.service';
import { ObjetivoController } from './objetivo.controller';

@Module({
  controllers: [ObjetivoController],
  providers: [ObjetivoService],
})
export class ObjetivoModule {}
