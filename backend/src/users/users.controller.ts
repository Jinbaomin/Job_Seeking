import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TestGuard } from './test.guard';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './interface/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users') // Swagger tag
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create a new user successfully')
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Get all users successfully')
  // @UseGuards(TestGuard) // Apply the TestGuard to this route
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('role') role: string
  ) {
    return this.usersService.findAll(+page, +limit, search, status, role);
  }

  @ResponseMessage('Change password successfully')
  @Post('change-password')
  async changePassword(
    @User() user: IUser, 
    @Body('oldPassword') oldPassword: string, 
    @Body('newPassword') newPassword: string
  ) {
    return await this.usersService.changePassword(user, oldPassword, newPassword);
  }

  @Get(':id')
  @ResponseMessage('Get user successfully')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update user successfully')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return await this.usersService.update(id, updateUserDto, user);
  }

  @Patch(':id/status')
  @ResponseMessage('Update user status successfully')
  async toggleStatus(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return await this.usersService.toggleStatus(id, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete user successfully')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
