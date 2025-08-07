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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/interface/user.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    return this.postsService.findAll(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user: IUser
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete post successfully")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.postsService.remove(id, user);
  }

  @Post(':id/like')
  @ResponseMessage("Like post successfully")
  likePost(@Param('id') id: string, @User() user: IUser) {
    return this.postsService.likePost(id, user._id);
  }
} 