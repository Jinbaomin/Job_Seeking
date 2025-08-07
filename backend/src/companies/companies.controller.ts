import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/interface/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('companies') // Swagger tag
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Get all companies successfully')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
    @Query('search') search: string
  ) {
    return await this.companiesService.findAll(+page, +limit, { search });
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Get company by ID successfully')
  async findOne(@Param('id') id: string) {
    return await this.companiesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    return await this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.companiesService.remove(id, user);
  }
}
