import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/services/auth.service';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from '../../src/auth/dtos/loginUser.dto';
import { RegisterDto } from '../../src/auth/dtos/register.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    name: 'juanperez',
    password: 'hashedPassword',
    email: 'juan@example.com',
  };

  const mockUsersService = {
    findUserByName: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe retornar un token si las credenciales son válidas', async () => {
      const dto: loginDto = { name: 'juanperez', password: 'contraseñaSegura123' };
      mockUsersService.findUserByName.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt.token');

      const result = await service.login(dto);
      expect(result).toEqual({ access_token: 'jwt.token' });
      expect(mockUsersService.findUserByName).toHaveBeenCalledWith('juanperez');
      expect(bcrypt.compare).toHaveBeenCalledWith('contraseñaSegura123', 'hashedPassword');
    });

    it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
      mockUsersService.findUserByName.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ name: 'noexiste', password: '123' })).rejects.toThrow('Credenciales inválidas');
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      mockUsersService.findUserByName.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ name: 'juanperez', password: 'wrong' })).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('register', () => {
    it('debe registrar un usuario si no existe', async () => {
      const dto: RegisterDto = { name: 'nuevo', password: 'clave', email: 'nuevo@example.com' };
      mockUsersService.findUserByName.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedClave');
      mockUsersService.createUser.mockResolvedValue({ id: 2, ...dto, password: 'hashedClave' });

      const result = await service.register(dto);
      expect(mockUsersService.findUserByName).toHaveBeenCalledWith('nuevo');
      expect(bcrypt.hash).toHaveBeenCalledWith('clave', 10);
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        name: 'nuevo',
        email: 'nuevo@example.com',
        password: 'hashedClave',
      });
      expect(result).toEqual({ id: 2, ...dto, password: 'hashedClave' });
    });

    it('debe lanzar UnauthorizedException si el usuario ya existe', async () => {
      mockUsersService.findUserByName.mockResolvedValue(mockUser);

      await expect(service.register({ name: 'juanperez', password: 'clave', email: 'juan@example.com' }))
        .rejects.toThrow('El usuario ya existe');
    });
  });
});