import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { User } from '../entities/users.entity';
import { UsersService } from '../services/users.service';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado', type: User })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
  async findAllUsers(): Promise<User[]> {
    return await this.usersService.findAllUsers();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findUserById(@Param('id') id: number): Promise<User> {
    return await this.usersService.findUserById(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('name/:name')
  @ApiOperation({ summary: 'Obtener un usuario por nombre' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findUserByName(@Param('name') name: string): Promise<User> {
    return await this.usersService.findUserByName(name);
  }



  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async deleteUser(@Param('id') id: number): Promise<void> {
    return await this.usersService.deleteUser(id);
  }
}
