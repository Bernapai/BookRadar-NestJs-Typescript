import { Controller, Get, Query, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { GetBooksDto } from './books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get()
  async getBooks(@Query('q') query: string): Promise<GetBooksDto[]> {
    return this.booksService.getAll(query);
  }

  // GET /books/:id
  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<GetBooksDto> {
    return this.booksService.getOne(id);
  }
}
