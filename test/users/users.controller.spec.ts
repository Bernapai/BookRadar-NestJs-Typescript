import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/controllers/users.controller';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from '../../src/users/dtos/createUser.dto';
import { UpdateUserDto } from '../../src/users/dtos/updateUser.dto';
import { User } from '../../src/users/entities/users.entity';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser: User = {
    id: 1,
    name: 'Charlie',
    email: 'charlie@example.com',
    password: 'securepassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    createUser: jest.fn(),
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    jest.clearAllMocks(); // Limpia llamados antes de cada test
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const dto: CreateUserDto = {
        name: 'Charlie',
        email: 'charlie@example.com',
        password: 'securepassword123',
      };

      mockUsersService.createUser.mockResolvedValue(mockUser);
      const result = await controller.createUser(dto);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUsersService.findAllUsers.mockResolvedValue(users);

      const result = await controller.findAllUsers();
      expect(result).toEqual(users);
      expect(mockUsersService.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      mockUsersService.findUserById.mockResolvedValue(mockUser);

      const result = await controller.findUserById(1);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const updateDto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpass456',
      };

      const updatedUser = { ...mockUser, ...updateDto };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(1, updateDto);
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      mockUsersService.deleteUser.mockResolvedValue(undefined);

      const result = await controller.deleteUser(1);
      expect(result).toBeUndefined();
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
