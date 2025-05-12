import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BooksModule, FavoritosModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
