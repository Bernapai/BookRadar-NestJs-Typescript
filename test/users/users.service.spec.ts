import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import { UpdateUserDto } from 'src/users/dtos/updateUser.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@gmail.com',
    password: 'password123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllUsers', () => {
    it('debe retornar todos los usuarios', async () => {
      mockUserRepository.find.mockResolvedValue([mockUser]);
      const result = await service.findAllUsers();
      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it('debe manejar errores', async () => {
      mockUserRepository.find.mockRejectedValue(new Error('Error'));
      await expect(service.findAllUsers()).rejects.toThrow('Error');
    });
  });

  describe('findUserById', () => {
    it('debe retornar un usuario por id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findUserById(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debe lanzar error si no existe el usuario', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);
      await expect(service.findUserById(999)).rejects.toThrow('User with id 999 not found');
    });

    it('debe manejar errores inesperados', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('Error'));
      await expect(service.findUserById(1)).rejects.toThrow('Error');
    });
  });

  describe('findUserByName', () => {
    it('debe retornar un usuario por nombre', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findUserByName('John Doe');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { name: 'John Doe' } });
    });

    it('debe lanzar error si no existe el usuario', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);
      await expect(service.findUserByName('NonExistent')).rejects.toThrow('User with name NonExistent not found');
    });

    it('debe manejar errores inesperados', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('Error'));
      await expect(service.findUserByName('John Doe')).rejects.toThrow('Error');
    });
  });

  describe('createUser', () => {
    it('debe crear y retornar un usuario', async () => {
      const dto: CreateUserDto = { name: 'John Doe', email: 'john@gmail.com', password: 'password123' };
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(dto);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('debe manejar errores al crear usuario', async () => {
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockRejectedValue(new Error('Error'));
      await expect(service.createUser({ name: '', email: '', password: '' })).rejects.toThrow('Error');
    });
  });

  describe('updateUser', () => {
    it('debe actualizar y retornar el usuario', async () => {
      const dto: UpdateUserDto = { name: 'Nuevo Nombre' };
      const updatedUser = { ...mockUser, ...dto };
      mockUserRepository.update.mockResolvedValue(undefined);
      mockUserRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, dto);
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, dto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debe manejar errores al actualizar usuario', async () => {
      mockUserRepository.update.mockRejectedValue(new Error('Error'));
      await expect(service.updateUser(1, { name: 'Nuevo Nombre' })).rejects.toThrow('Error');
    });
  });

  describe('deleteUser', () => {
    it('debe eliminar el usuario', async () => {
      mockUserRepository.delete.mockResolvedValue(undefined);
      await expect(service.deleteUser(1)).resolves.toBeUndefined();
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('debe manejar errores al eliminar usuario', async () => {
      mockUserRepository.delete.mockRejectedValue(new Error('Error'));
      await expect(service.deleteUser(1)).rejects.toThrow('Error');
    });
  });
});