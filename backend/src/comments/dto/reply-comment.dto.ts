import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class ReplyCommentDTO {
  @IsString()
  content: string;
} 