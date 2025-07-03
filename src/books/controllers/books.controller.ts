import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { GetBooksDto } from '../dtos/books.dto';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get()
  @ApiOperation({ summary: 'Buscar libros por texto' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Texto de búsqueda (título, autor, etc.)',
    example: 'Clean Code',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de libros encontrados',
    type: [GetBooksDto],
  })
  async getBooks(@Query('q') query: string): Promise<GetBooksDto[]> {
    return this.booksService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un libro por ID de Google Books' })
  @ApiResponse({
    status: 200,
    description: 'Libro encontrado',
    type: GetBooksDto,
  })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  async getBookById(@Param('id') id: string): Promise<GetBooksDto> {
    return this.booksService.getOne(id);
  }
}
