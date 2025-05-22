import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

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
    it('should return all users', async () => {
      const users = [{ id: 1, name: 'Alice' }] as User[];
      mockUserRepository.find.mockResolvedValue(users);

      expect(await service.findAllUsers()).toBe(users);
      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'Alice' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      expect(await service.findUserById(1)).toBe(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findUserById(999)).rejects.toThrow(
        'User with id 999 not found',
      );
    });
  });

  describe('findUserByName', () => {
    it('should return a user by name', async () => {
      const user = { id: 1, name: 'Bob' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      expect(await service.findUserByName('Bob')).toBe(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Bob' },
      });
    });

    it('should throw if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findUserByName('NonExistent')).rejects.toThrow(
        'User with name NonExistent not found',
      );
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const dto: CreateUserDto = {
        name: 'Charlie',
        email: 'charlie@example.com',
        password: 'securepassword123',
      };
      const createdUser = { id: 1, ...dto } as User;

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      expect(await service.createUser(dto)).toBe(createdUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
    });
  });

  describe('updateUser', () => {
    it('should update and return the updated user', async () => {
      const dto: UpdateUserDto = { name: 'UpdatedName' };
      const updatedUser = { id: 1, name: 'UpdatedName' } as User;

      mockUserRepository.update.mockResolvedValue(undefined);
      mockUserRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, dto);
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUserRepository.delete.mockResolvedValue(undefined);

      await service.deleteUser(1);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
