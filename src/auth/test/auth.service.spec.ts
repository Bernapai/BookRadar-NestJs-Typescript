import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findUserByName: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debería devolver un token si las credenciales son válidas', async () => {
    const loginDto = { name: 'testuser', password: '1234' };
    const mockUser = { id: 1, name: 'testuser', password: '1234' };
    const mockToken = 'token123';

    (usersService.findUserByName as jest.Mock).mockResolvedValue(mockUser);
    (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

    const result = await service.login(loginDto);

    expect(usersService.findUserByName).toHaveBeenCalledWith('testuser');
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: 1, name: 'testuser' });
    expect(result).toEqual({ access_token: mockToken });
  });

  it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
    const loginDto = { name: 'wronguser', password: '1234' };
    (usersService.findUserByName as jest.Mock).mockResolvedValue(null);

    await expect(service.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
    const loginDto = { name: 'testuser', password: 'wrongpass' };
    const mockUser = { id: 1, name: 'testuser', password: 'correctpass' };
    (usersService.findUserByName as jest.Mock).mockResolvedValue(mockUser);

    await expect(service.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
