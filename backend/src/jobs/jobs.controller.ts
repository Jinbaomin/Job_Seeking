import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/interface/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('jobs') // Swagger tag
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage('Create a job successfully')
  async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return await this.jobsService.create(createJobDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Get all jobs successfully')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
    @Query('search') search: string = '',
    @Query('companyId') companyId: string = '',
    @Query('skills') skills: string = '',
    @Query('level') level: string = ''
  ) {
    return await this.jobsService.findAll(+page, +limit, { search, companyId, skills, level });
  }

  @Get(':id')
  @ResponseMessage('Get job details successfully')
  async findOne(@Param('id') id: string) {
    return await this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a job successfully')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return await this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a job successfully')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
