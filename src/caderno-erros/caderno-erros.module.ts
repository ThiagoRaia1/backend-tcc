import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RespostaQuiz } from 'src/resposta-quiz/entities/resposta-quiz.entity';
import { CadernoErrosController } from './caderno-erros.controller';
import { CadernoErrosService } from './caderno-erros.service';

@Module({
  imports: [TypeOrmModule.forFeature([RespostaQuiz])],
  controllers: [CadernoErrosController],
  providers: [CadernoErrosService],
  exports: [CadernoErrosService],
})
export class CadernoErrosModule {}
