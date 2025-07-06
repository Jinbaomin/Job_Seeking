import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  age:string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  address: string;

  // @IsNotEmpty()
  role: string;

  // @IsNotEmptyObject()
  // @IsObject()
  // @ValidateNested({ each: true })
  // @Type(() => Company)
  company?: Company;
}


export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  age: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  address: string;

  role?: string; // Optional field, can be omitted during registration
}
