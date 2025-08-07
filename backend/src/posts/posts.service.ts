import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IUser } from 'src/users/interface/user.interface';
import { UpdateJobDto } from 'src/jobs/dto/update-job.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) { }

  async create(createPostDto: CreatePostDto, user: IUser): Promise<Post> {
    const author = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
    };

    return await this.postModel.create({
      ...createPostDto,
      author,
      likes: [],
      comments: [],
    });
  }

  async findAll(page: number = 1, limit: number = 5) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.postModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .populate({
          path: 'likes',
          select: 'name email avatar _id'
        })
        .populate({
          path: 'comments',
          select: 'content author createdAt likes',
        })
        .limit(limit)
        .exec(),
      this.postModel.countDocuments({ isDeleted: false }),
    ]);

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        pages: Math.ceil(total / limit),
        total
      },
      result: posts
    };
  }

  async findOne(id: string): Promise<Post> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid post ID: ${id}`);
    }

    const post = await this.postModel
      .findOne({ _id: id, isDeleted: false })
      .populate({
        path: 'likes',
        select: 'name email avatar _id',
      })
      .populate({
        path: 'comments',
        select: 'content author createdAt likes replies',
      })
      .exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: IUser): Promise<Post> {
    const post = await this.findOne(id);

    if (post.author._id.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        id,
        updatePostDto,
        {
          new: true, populate: {
            path: 'likes',
            select: 'name email avatar _id'
          }
        })
      .exec();

    return updatedPost;
  }

  async remove(id: string, user: IUser): Promise<void> {
    const post = await this.findOne(id);

    if (post.author._id.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: {
        _id: user._id,
        name: user.name,
      },
    });
  }

  async likePost(id: string, userId: any): Promise<Post> {
    const post = await this.findOne(id);

    const likeIndex = post.likes.findIndex(like => {
      // Nếu like là object (đã populate)
      if (typeof like === 'object' && '_id' in like) {
        return like._id.toString() === userId.toString();
      }
      // Nếu like là ObjectId (chưa populate)
      return like.toString() === userId.toString();
    });

    if (likeIndex === -1) {
      // Add like
      post.likes.push(userId);
    } else {
      // Remove like
      post.likes.splice(likeIndex, 1);
    }

    return await this.postModel.findByIdAndUpdate(
      id,
      post,
      {
        new: true,
        populate: {
          path: 'likes',
          select: 'name email avatar _id'
        }
      }
    );
  }
}