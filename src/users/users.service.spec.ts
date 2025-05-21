import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(
      getRepositoryToken(User),
    ) as jest.Mocked<Repository<User>>;
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };
    const user = { id: 1, ...dto } as User;

    repo.create.mockReturnValue(user);
    repo.save.mockResolvedValue(user);

    const result = await service.createUser(dto);

    (repo.create as jest.Mock) = jest.fn(() => user);
    (repo.save as jest.Mock) = jest.fn(async () => user);
    expect(result).toEqual(user);
  });

  it('should find all users', async () => {
    const users = [
      { id: 1, name: 'John' } as User,
      { id: 2, name: 'Jane' } as User,
    ];
    repo.find.mockResolvedValue(users);

    const result = await service.findAllUsers();

    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('should find user by id', async () => {
    const user = { id: 1, name: 'John' } as User;
    repo.findOne.mockResolvedValue(user);

    const result = await service.findUserById(1);

    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(user);
  });

  it('should throw error if user by id not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findUserById(1)).rejects.toThrow(
      'User with id 1 not found',
    );
  });

  it('should find user by name', async () => {
    const user = { id: 1, name: 'John' } as User;
    repo.findOne.mockResolvedValue(user);

    const result = await service.findUserByName('John');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { name: 'John' } });
    expect(result).toEqual(user);
  });

  it('should throw error if user by name not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findUserByName('John')).rejects.toThrow(
      'User with name John not found',
    );
  });

  it('should update user', async () => {
    const updateDto: UpdateUserDto = { name: 'Updated Name' };
    const updatedUser = { id: 1, name: 'Updated Name' } as User;

    repo.update.mockResolvedValue({ affected: 1 } as any);
    jest.spyOn(service, 'findUserById').mockResolvedValue(updatedUser);

    const result = await service.updateUser(1, updateDto);

    expect(repo.update).toHaveBeenCalledWith(1, updateDto);
    expect(service.findUserById).toHaveBeenCalledWith(1);
    expect(result).toEqual(updatedUser);
  });

  it('should throw error if update affects no rows', async () => {
    const updateDto: UpdateUserDto = { name: 'Updated Name' };

    repo.update.mockResolvedValue({ affected: 0 } as any);

    await expect(service.updateUser(1, updateDto)).rejects.toThrow(
      'User with id 1 not found',
    );
  });

  it('should delete user', async () => {
    repo.delete.mockResolvedValue({ affected: 1 } as any);

    await service.deleteUser(1);

    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error if delete affects no rows', async () => {
    repo.delete.mockResolvedValue({ affected: 0 } as any);

    await expect(service.deleteUser(1)).rejects.toThrow(
      'User with id 1 not found',
    );
  });
});
