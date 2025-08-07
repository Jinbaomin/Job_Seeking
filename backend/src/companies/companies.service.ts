import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/interface/user.interface';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import mongoose from 'mongoose';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) { }

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.companyModel.create({
      ...createCompanyDto, createdBy: {
        _id: user._id, email: user.email,
      }
    });
  }

  async findAll(page: number, limit: number, query: Object) {
    // const companies = await this.companyModel.find().skip((page - 1) * limit).limit(limit);

    let filter: any = { $or: [] };

    if (query['search']) {
      filter.$or.push({ name: { $regex: query['search'], $options: 'i' } }); // case-insensitive search
      filter.$or.push({ address: { $regex: query['search'], $options: 'i' } }); // case-insensitive search
    } 

    if(filter.$or.length === 0) delete filter.$or;

    const [result, count] = await Promise.all([
      this.companyModel.find(filter).skip((page - 1) * limit).limit(limit),
      this.companyModel.find(filter)
    ]);

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        pages: Math.ceil(count.length / limit),
        total: count.length,
      },
      result
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new BadRequestException(`Invalid company ID: ${id}`);
    }

    return await this.companyModel.findById(id);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    if (!this.companyModel.findById(id)) {
      return `Company with ID ${id} does not exist`;
    }

    return await this.companyModel.findOneAndUpdate({ _id: id }, {
      ...updateCompanyDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
    }, { new: true });
  }

  async remove(id: string, user: IUser) {
    if (!this.companyModel.findById(id)) {
      return `Company with ID ${id} does not exist`;
    }

    await this.companyModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email,
      }
    });

    return this.companyModel.softDelete({ _id: id });
  }
}
