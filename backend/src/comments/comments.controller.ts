import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IUser } from 'src/users/interface/user.interface';
import { User } from 'src/decorator/customize';
import { ReplyCommentDTO } from './dto/reply-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: IUser) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.commentsService.findAll(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: IUser,
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.commentsService.remove(id, user);
  }

  @Post(':id/like')
  likeComment(@Param('id') id: string, @User() user: IUser) {
    return this.commentsService.likeComment(id, user._id);
  }

  @Post(':id/reply')
  replyComment(@Param('id') id: string, @Body() replyCommentDto: ReplyCommentDTO, @User() user: IUser) {
    return this.commentsService.replyComment(id, replyCommentDto, user);
  }

  // Lấy comments theo postId
  @Get('post/:postId')
  findByPostId(
    @Param('postId') postId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.commentsService.findByPostId(postId, parseInt(page), parseInt(limit));
  }

  // Lấy replies của một comment
  @Get(':id/replies')
  getReplies(@Param('id') id: string) {
    return this.commentsService.getReplies(id);
  }
} 