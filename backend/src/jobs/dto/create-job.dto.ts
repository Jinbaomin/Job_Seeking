import { Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  skills: string[];

  // @IsNotEmptyObject()
  // @IsObject()
  // @ValidateNested({ each: true })
  // @Type(() => Company)
  // company: Company;

  @IsNotEmpty()
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  level: string;

  @IsNotEmpty()
  description: string;

  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}
