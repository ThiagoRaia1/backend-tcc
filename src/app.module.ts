import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { EtapaModule } from './etapa/etapa.module';
import { ObjetivoModule } from './objetivo/objetivo.module';
import { RecursoSugeridoModule } from './recurso-sugerido/recurso-sugerido.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        // Não use synchronize: true em produção
        synchronize: true,
      }),
    }),
    UsuarioModule,
    AuthModule,
    RoadmapModule,
    EtapaModule,
    ObjetivoModule,
    RecursoSugeridoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
