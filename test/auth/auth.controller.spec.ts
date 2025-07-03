import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/controllers/auth.controller';
import { AuthService } from '../../src/auth/services/auth.service';
import { loginDto } from '../../src/auth/dtos/loginUser.dto';
import { RegisterDto } from '../../src/auth/dtos/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe retornar un token al loguear correctamente', async () => {
      const dto: loginDto = { name: 'juanperez', password: 'contraseñaSegura123' };
      const token = { access_token: 'jwt.token' };
      mockAuthService.login.mockResolvedValue(token);

      const result = await controller.login(dto);
      expect(result).toEqual(token);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });

    it('debe manejar errores al loguear', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Credenciales inválidas'));
      await expect(controller.login({ name: 'juanperez', password: 'wrong' })).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('register', () => {
    it('debe registrar un usuario correctamente', async () => {
      const dto: RegisterDto = { name: 'juanperez', password: 'contraseñaSegura123', email: 'juan@example.com' };
      const user = { id: 1, ...dto };
      mockAuthService.register.mockResolvedValue(user);

      const result = await controller.register(dto);
      expect(result).toEqual(user);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });

    it('debe manejar errores al registrar', async () => {
      mockAuthService.register.mockRejectedValue(new Error('El usuario ya existe'));
      await expect(controller.register({ name: 'juanperez', password: '123', email: 'juan@example.com' })).rejects.toThrow('El usuario ya existe');
    });
  });
});