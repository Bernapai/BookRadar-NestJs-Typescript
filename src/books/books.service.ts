import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { GetBooksDto } from './books.dto';
import { GoogleBooksResponse, GoogleBook } from './books.interface';
@Injectable()
export class BooksService {
  private readonly GOOGLE_BOOKS_API =
    'https://www.googleapis.com/books/v1/volumes';

  // Buscar libros por query
  async getAll(query: string): Promise<GetBooksDto[]> {
    if (!query || typeof query !== 'string' || !query.trim()) {
      throw new HttpException(
        'La consulta no puede estar vacía',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const response = await axios.get<GoogleBooksResponse>(
        `${this.GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}`,
      );

      const items: unknown = response.data?.items;
      if (!Array.isArray(items)) {
        return [];
      }

      return items.map((item: GoogleBook) => {
        const info = item.volumeInfo || {};
        return {
          googleId: item.id ?? '',
          title: info.title ?? '',
          authors: Array.isArray(info.authors) ? info.authors : [],
          thumbnail: info.imageLinks?.thumbnail ?? '',
          description: info.description ?? '',
        } as GetBooksDto;
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Usa el mensaje de error si existe, sino uno genérico
        const data = error.response?.data as
          | { error?: { message?: string } }
          | undefined;
        const message =
          data?.error?.message || error.message || 'Error al buscar libros';
        const status =
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(message, status);
      }
      throw new HttpException(
        'Error inesperado al buscar libros',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener un libro por ID
  async getOne(id: string): Promise<GetBooksDto> {
    if (!id || typeof id !== 'string' || !id.trim()) {
      throw new HttpException(
        'El ID no puede estar vacío',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const response = await axios.get<GoogleBook>(
        `${this.GOOGLE_BOOKS_API}/${encodeURIComponent(id)}`,
      );

      const info = response.data?.volumeInfo || {};

      return {
        googleId: response.data?.id ?? '',
        title: info.title ?? '',
        authors: Array.isArray(info.authors) ? info.authors : [],
        thumbnail: info.imageLinks?.thumbnail ?? '',
        description: info.description ?? '',
      } as GetBooksDto;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new HttpException('Libro no encontrado', HttpStatus.NOT_FOUND);
        }

        const data: unknown = error.response?.data;
        let message: string = 'Error al obtener el libro';
        if (
          data &&
          typeof data === 'object' &&
          'error' in data &&
          typeof (data as { error?: { message?: string } }).error?.message ===
          'string'
        ) {
          message = (data as { error: { message: string } }).error.message;
        }

        throw new HttpException(
          message,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Error inesperado al obtener el libro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
