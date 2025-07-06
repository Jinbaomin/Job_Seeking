import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCVDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/interface/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes') // Swagger tag
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage('Resume created successfully')
  async create(@Body() createResumeDto: CreateUserCVDto, @User() user: IUser) {
    return await this.resumesService.create(createResumeDto, user);
  }

  @Get()
  @ResponseMessage('Get all resumes successfully')
  findAll(
    @Query('current') page: string = '1',
    @Query('pageSize') limit: string = '5',
    @Query('status') status: string,
    @Query('query') query: string
  ) {
    return this.resumesService.findResume(+page, +limit, null, status, query);
  }

  @Get('/me')
  @ResponseMessage('Get resumes by user successfully')
  async findResumeByUser(
    @User() user: IUser,
    @Query('current') page: string = '1',
    @Query('pageSize') limit: string = '5',
    @Query('status') status: string,
    @Query('query') query: string
  ) {
    return await this.resumesService.findResume(+page, +limit, user._id, status, query);
  }

  @Get(':id')
  @ResponseMessage('Get resume details successfully')
  async findOne(@Param('id') id: string) {
    return await this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Resume updated successfully')
  async update(@Param('id') id: string, @Body('status') status: string, @User() user: IUser) {
    return await this.resumesService.update(id, status, user);
  }

  @Patch(':id/status')
  @ResponseMessage('Resume status updated successfully')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @User() user: IUser
  ) {
    return await this.resumesService.updateStatus(id, status, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.resumesService.remove(id, user);
  }

  @Post('by-user')
  @ResponseMessage('Get resume by user successfully')
  async getResumesByUser(@User() user: IUser) {
    return await this.resumesService.findByUser(user);
  }
}
