import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsMongoId()
  postId: string;

  @IsOptional()
  @IsMongoId()
  parentCommentId?: string;
} 