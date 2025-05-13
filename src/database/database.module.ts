import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de base de datos
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Juanber123()',
      database: 'bookradar',
      entities: [__dirname + '/../**/*.entity.ts'],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule { }
