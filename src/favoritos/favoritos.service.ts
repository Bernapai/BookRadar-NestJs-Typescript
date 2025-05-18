import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './dtos/createFavorito.dto';
import { BooksService } from '../books/books.service';
import { GetBooksDto } from '../books/books.dto';
@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito)
    private readonly favoritoRepo: Repository<Favorito>,
    private readonly booksService: BooksService,
  ) { }

  // POST /favoritos/:id
  async guardarFavorito(id: string): Promise<Favorito> {
    const libro: GetBooksDto = await this.booksService.getOne(id);

    const nuevo = this.favoritoRepo.create(libro);
    return await this.favoritoRepo.save(nuevo);
  }

  // GET /favoritos
  async obtenerTodos(): Promise<Favorito[]> {
    return await this.favoritoRepo.find();
  }
}
