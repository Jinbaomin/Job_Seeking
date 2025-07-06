import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCVDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/interface/user.interface';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }

  async create(createResumeDto: CreateUserCVDto, user: IUser) {
    return await this.resumeModel.create({
      ...createResumeDto,
      companyId: new Types.ObjectId('' + createResumeDto.companyId),
      jobId: new Types.ObjectId('' + createResumeDto.jobId),
      email: user.email,
      userId: user._id,
      status: 'PENDING',
      // history: {
      //   status: 'PENDING',
      //   updatedBy: {
      //     _id: user._id,
      //     email: user.email,
      //   },
      //   updatedAt: new Date(),
      // },
      createdBy: {
        userId: user._id,
        email: user.email,
      }
    });
  }

  async findAll(page: number, limit: number) {
    let filter: any = {};
    const data = await this.resumeModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('companyId')
      .populate('jobId')
      .select('-__v');

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        pages: Math.ceil(data.length / limit),
        total: data.length,
      },
      result: data
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    return await this.resumeModel.findById(id);
  }

  async findResume(page: number, limit: number, userId?: string, status?: string, query?: string) {
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   throw new BadRequestException('Invalid User ID format');
    // }

    let pipeline: any = [];

    // // if (status) {
    // //   pipeline.push({ $match: { status } });
    // // }

    // // Step 2: Lookup (populate) the data
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    pipeline.push({
      $lookup: {
        from: 'companies', // collection name
        localField: 'companyId',
        foreignField: '_id',
        as: 'company'
      }
    });

    pipeline.push({
      $lookup: {
        from: 'users', // collection name
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    });

    pipeline.push({
      $lookup: {
        from: 'jobs', // collection name
        localField: 'jobId',
        foreignField: '_id',
        as: 'job'
      }
    });

    pipeline.push({ $unwind: '$company' });
    pipeline.push({ $unwind: '$job' });
    pipeline.push({ $unwind: '$user' });

    // pipeline.push({ $match: { userId } });

    if (query) {
      const filter = {
        $or: [
          { 'email': { $regex: query, $options: 'i' } },
          { 'job.name': { $regex: query, $options: 'i' } },
          { 'company.name': { $regex: query, $options: 'i' } },
          { 'user.name': { $regex: query, $options: 'i' } },
        ],
      }

      pipeline.push({ $match: filter });
    }

    // Step 3: Match the userId and status if provided
    if (userId) {
      pipeline.push({ $match: { userId: new Types.ObjectId(userId) } });
    }

    if (status) {
      pipeline.push({ $match: { status } });
    }

    const [resumes, totalResumes] = await Promise.all([
      this.resumeModel.aggregate(pipeline),
      this.resumeModel.countDocuments(),
    ]);

    // let filter: any = {};

    // filter.userId = userId;
    // if (status) filter.status = status;

    // // if (query) {
    // //   filter.$or = [
    // //     { email: { $regex: query, $options: 'i' } },
    // //     { jobId: { 'name': { $regex: query, $options: 'i' } } },
    // //   ];
    // // }

    // const resumes = await this.resumeModel
    //   .find(filter)
    //   .populate('jobId')
    //   .populate('companyId');

    return {
      meta: {
        currentPage: page,
        pageSize: resumes.length,
        pages: Math.ceil(totalResumes / limit),
        total: totalResumes,
      },
      result: resumes.map(resume => ({
        ...resume,
        companyId: resume.company,
        jobId: resume.job,
        userId: resume.user,
      }))
    }
  }

  async update(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    return await this.resumeModel.findOneAndUpdate({ _id: id }, {
      status,
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
    }, { new: true, populate: ['companyId', 'jobId', 'userId'] });
  }

  async updateStatus(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    return await this.resumeModel.findOneAndUpdate({ _id: id }, {
      status,
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
    }, { new: true, populate: ['companyId', 'jobId', 'userId'] });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    await this.resumeModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email,
      },
    })

    return this.resumeModel.softDelete({ _id: id });
  }

  async findByUser(user: IUser) {
    return await this.resumeModel.find({ userId: user._id });
  }
}
