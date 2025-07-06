import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';

export class UpdateResumeBy {
  @IsNotEmpty()
  _Id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

class History {
  @IsNotEmpty()
  status: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UpdateResumeBy)
  updatedBy: UpdateResumeBy;

  @IsNotEmpty()
  updatedAt: Date;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @ValidateNested()
  @IsArray()
  @IsNotEmpty()
  @Type(() => History)
  history: History[];
}
