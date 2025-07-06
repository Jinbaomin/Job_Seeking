import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/interface/user.interface';
import { Types } from 'mongoose';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) { }

  async create(createJobDto: CreateJobDto, user: IUser) {
    return await this.jobModel.create({
      ...createJobDto,
      companyId: new Types.ObjectId('' + createJobDto.companyId),
      isActive: true,
      startDate: new Date(),
      endDate: new Date(),
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    });
  }

  async findAll(page: number, limit: number, query: Object) {
    // let filter: any = {};

    // if(query['search']) filter['name'] = { $regex: query['search'], $options: 'i' }; // case-insensitive search

    // const [result, count] = await Promise.all([
    //   this.jobModel
    //   .find(filter)
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .populate('companyId')
    //   .select('-__v'),
    //   this.jobModel.countDocuments({ isDeleted: false })
    // ]);

    const pipeline: any[] = [];

    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'company' } },
      { $unwind: '$company' },
    );

    if (query['search']) {
      pipeline.push({
        $match: {
          name: { $regex: query['search'], $options: 'i' } // case-insensitive search
        }
      });
    }

    if (query['companyId']) {
      pipeline.push({
        $match: {
          'company._id': new Types.ObjectId(query['companyId']) // match specific company by ID
        }
      });
    }

    if (query['skills']) {
      pipeline.push({
        $match: {
          skills: { $in: query['skills'].split(',').map(skill => skill.trim()) } // match any of the skills
        }
      });
    }

    if (query['level']) {
      pipeline.push({
        $match: {
          level: { $regex: query['level'], $options: 'i' } // case-insensitive search
        }
      });
    }

    const [companies, count] = await Promise.all([
      this.jobModel.aggregate(pipeline),
      this.jobModel.countDocuments()
    ]);

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        pages: Math.ceil(count / limit),
        total: count,
      },
      result: companies.map(company => {
        return {
          ...company,
          companyId: company.company, // Ensure companyId is the ObjectId
        };
      })
    }
  }

  async findOne(id: string) {
    return await this.jobModel.findOne({ _id: id }).populate('companyId').select('-__v');
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const job = await this.jobModel.findOneAndUpdate({ _id: id }, {
      ...updateJobDto,
      companyId: new Types.ObjectId('' + updateJobDto.companyId),
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
    }, { new: true });

    return job;
  }

  async remove(id: string) {
    return this.jobModel.softDelete({ _id: id });
  }
}
