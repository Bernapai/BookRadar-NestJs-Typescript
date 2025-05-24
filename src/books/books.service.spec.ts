import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import axios from 'axios';
import { HttpException } from '@nestjs/common';
import { GetBooksDto } from './books.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  describe('getAll', () => {
    it('debería devolver una lista de libros correctamente', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: '123',
              volumeInfo: {
                title: 'Libro de prueba',
                authors: ['Autor Uno'],
                imageLinks: {
                  thumbnail: 'url_thumbnail',
                },
                description: 'Una descripción',
              },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse as any);

      const result = await service.getAll('NestJS');
      expect(result).toEqual([
        {
          googleId: '123',
          title: 'Libro de prueba',
          authors: ['Autor Uno'],
          thumbnail: 'url_thumbnail',
          description: 'Una descripción',
        } as GetBooksDto,
      ]);
    });

    it('debería lanzar error si la query es inválida', async () => {
      await expect(service.getAll('')).rejects.toThrow(HttpException);
    });

    it('debería devolver [] si items no es un array', async () => {
      mockedAxios.get.mockResolvedValue({ data: { items: null } } as any);
      const result = await service.getAll('Test');
      expect(result).toEqual([]);
    });

    it('debería lanzar HttpException si axios lanza un error', async () => {
      mockedAxios.get.mockRejectedValue({
        isAxiosError: true,
        message: 'Error simulado',
        response: { status: 500 },
      });

      await expect(service.getAll('error')).rejects.toThrow(HttpException);
    });
  });

  describe('getOne', () => {
    it('debería devolver un libro correctamente por ID', async () => {
      const mockBook = {
        data: {
          id: 'abc',
          volumeInfo: {
            title: 'Un título',
            authors: ['Autor Uno'],
            imageLinks: {
              thumbnail: 'thumb.jpg',
            },
            description: 'Descripción',
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockBook as any);

      const result = await service.getOne('abc');

      expect(result).toEqual({
        googleId: 'abc',
        title: 'Un título',
        authors: ['Autor Uno'],
        thumbnail: 'thumb.jpg',
        description: 'Descripción',
      } as GetBooksDto);
    });

    it('debería lanzar error si el ID es inválido', async () => {
      await expect(service.getOne('')).rejects.toThrow(HttpException);
    });

    it('debería lanzar error 404 si el libro no se encuentra', async () => {
      mockedAxios.get.mockRejectedValue({
        isAxiosError: true,
        response: { status: 404 },
      });

      await expect(service.getOne('no-existe')).rejects.toThrow(
        'Libro no encontrado',
      );
    });
  });
});
