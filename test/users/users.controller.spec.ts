import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'src/users/controllers/users.controller';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import { UpdateUserDto } from 'src/users/dtos/updateUser.dto';
import { User } from 'src/users/entities/users.entity';

import { HttpException, HttpStatus } from '@nestjs/common';


describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    findUserByName: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
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
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Add your tests here

  describe('findAllUsers', () => {
    it('debe retornar un array de usuarios', async () => {
      mockUserService.findAllUsers.mockResolvedValue([mockUser]);
      const result = await controller.findAllUsers();
      expect(result).toEqual([mockUser]);
      expect(mockUserService.findAllUsers).toHaveBeenCalled();
    });

    it('debe manejar errores', async () => {
      mockUserService.findAllUsers.mockRejectedValue(new Error('Error'));
      await expect(controller.findAllUsers()).rejects.toThrow('Error');
    });
  });

  describe('findUserById', () => {
    it('debe retornar un usuario por id', async () => {
      mockUserService.findUserById.mockResolvedValue(mockUser);
      const result = await controller.findUserById(1);
      expect(result).toEqual(mockUser);
      expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
    });

    it('debe manejar error si el usuario no existe', async () => {
      mockUserService.findUserById.mockRejectedValue(new Error('User with id 1 not found'));
      await expect(controller.findUserById(1)).rejects.toThrow('User with id 1 not found');
    });
  });

  describe('findUserByName', () => {
    it('debe retornar un usuario por nombre', async () => {
      mockUserService.findUserByName.mockResolvedValue(mockUser);
      const result = await controller.findUserByName('John Doe');
      expect(result).toEqual(mockUser);
      expect(mockUserService.findUserByName).toHaveBeenCalledWith('John Doe');
    });

    it('debe manejar error si el usuario no existe', async () => {
      mockUserService.findUserByName.mockRejectedValue(new Error('User with name John Doe not found'));
      await expect(controller.findUserByName('John Doe')).rejects.toThrow('User with name John Doe not found');
    });
  });

  describe('createUser', () => {
    it('debe crear y retornar un usuario', async () => {
      mockUserService.createUser.mockResolvedValue(mockUser);
      const dto: CreateUserDto = { name: 'John Doe', email: 'john@gmail.com', password: 'password123' };
      const result = await controller.createUser(dto);
      expect(result).toEqual(mockUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(dto);
    });

    it('debe manejar errores al crear usuario', async () => {
      mockUserService.createUser.mockRejectedValue(new Error('Error'));
      await expect(controller.createUser({ name: '', email: '', password: '' })).rejects.toThrow('Error');
    });
  });

  describe('updateUser', () => {
    it('debe actualizar y retornar el usuario', async () => {
      mockUserService.updateUser.mockResolvedValue(mockUser);
      const dto: UpdateUserDto = { name: 'Nuevo Nombre' };
      const result = await controller.updateUser(1, dto);
      expect(result).toEqual(mockUser);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(1, dto);
    });

    it('debe manejar errores al actualizar usuario', async () => {
      mockUserService.updateUser.mockRejectedValue(new Error('Error'));
      await expect(controller.updateUser(1, { name: 'Nuevo Nombre' })).rejects.toThrow('Error');
    });
  });

  describe('deleteUser', () => {
    it('debe eliminar el usuario', async () => {
      mockUserService.deleteUser.mockResolvedValue(undefined);
      await expect(controller.deleteUser(1)).resolves.toBeUndefined();
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
    });

    it('debe manejar errores al eliminar usuario', async () => {
      mockUserService.deleteUser.mockRejectedValue(new Error('Error'));
      await expect(controller.deleteUser(1)).rejects.toThrow('Error');
    });
  });


});