import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './interface/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  async create(createUserDto: CreateUserDto | RegisterUserDto, user: IUser = null) {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const hashPassword = this.getHashPassword(createUserDto.password);
    return await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      role: createUserDto.role || 'USER',
      createdBy: {
        _id: user?._id,
        email: user?.email,
      }
    });
  }

  async findAll(page: number, limit: number) {
    let filter: any = {
      $match: { isDeleted: { $in: [false, true] } }
    };

    // Validate page and limit
    const data = await this.userModel.aggregate([filter]);

    // const data = await this.userModel
    //   .find(filter)
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .select('-password -__v');

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        pages: Math.ceil(data.length / limit),
        total: data.length,
      },
      result: data
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `Invalid user ID: ${id}`;

    return this.userModel.findOne({ _id: id }).select('-password -__v');
  }

  findByEmail(email: string) {
    const user = this.userModel.findOne({ email });
    return user;
  }

  checkPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `Invalid user ID: ${id}`;

    return await this.userModel.findOneAndUpdate({ _id: id }, {
      ...updateUserDto, updatedBy: {
        _id: user._id,
        email: user.email,
      }
    }, { new: true, select: '-password -__v -refreshToken' });
  }

  async toggleStatus(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `Invalid user ID: ${id}`;

    const userData = await this.userModel.findOne({ _id: id });

    return await this.userModel.findOneAndUpdate({ _id: id }, {
      isDeleted: !userData.isDeleted,
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
    }, { new: true, select: '-password -__v -refreshToken' });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `Invalid user ID: ${id}`;

    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email,
      }
    });

    return this.userModel.softDelete({ _id: id });
  }

  async updateRefreshToken(id: string, token: string) {
    await this.userModel.updateOne({ _id: id }, {
      refreshToken: token,
    });
  }

  async findByRefreshToken(refreshToken: string) {
    return await this.userModel.findOne({ refreshToken });
  }

  async changePassword(user: IUser, oldPassword: string, newPassword: string) {
    const findedUser = await this.findByEmail(user.email);

    // Validate old password
    const isValidPassword = this.checkPassword(oldPassword, findedUser.password);
    if (!isValidPassword) {
      throw new BadRequestException('Old password is incorrect');
    }

    // Hash new password
    const hashedPassword = this.getHashPassword(newPassword);

    // Update user password
    await this.userModel.findOneAndUpdate({ _id: findedUser._id }, {
      password: hashedPassword,
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
    }, { new: true, select: '-password -__v' });
  }
}
