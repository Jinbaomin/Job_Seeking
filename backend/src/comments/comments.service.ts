import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IUser } from 'src/users/interface/user.interface';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';
import { ReplyCommentDTO } from './dto/reply-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) { }

  async create(createCommentDto: CreateCommentDto, user: IUser): Promise<Comment> {
    const author = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
    };

    const post = await this.postModel.findById(createCommentDto.postId);

    if (!post)
      throw new NotFoundException('Not found post by ID: ' + createCommentDto.postId);

    // Create a new comment
    const createdComment = await this.commentModel.create({
      ...createCommentDto,
      author,
      likes: [],
      replies: [],
    });

    // Update post's comments array
    await this.postModel.findByIdAndUpdate(
      createCommentDto.postId,
      { $push: { comments: createdComment._id } }
    );

    return createdComment;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.commentModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .populate({
          path: 'likes',
          select: 'name email avatar _id'
        })
        .populate({
          path: 'replies',
          select: 'content author createdAt likes'
        })
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments({ isDeleted: false }),
    ]);

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        pages: Math.ceil(total / limit),
        total
      },
      result: comments
    };
  }

  async findOne(id: string): Promise<Comment> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid comment ID: ${id}`);
    }

    const comment = await this.commentModel
      .findOne({ _id: id, isDeleted: false })
      .populate({
        path: 'likes',
        select: 'name email avatar _id'
      })
      .populate({
        path: 'replies',
        select: 'content author createdAt likes'
      })
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: IUser): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.author._id.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can only update your own comments');
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(
        id,
        updateCommentDto,
        {
          new: true,
          populate: {
            path: 'likes',
            select: 'name email avatar _id'
          }
        }
      )
      .exec();

    return updatedComment;
  }

  async remove(id: string, user: IUser): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.author._id.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: {
        _id: user._id,
        name: user.name,
      },
    });

    if (!comment.parentCommentId) 
      await this.commentModel.findByIdAndUpdate(id, { replies: [] });
  }

  async replyComment(id: string, replyCommentDto: ReplyCommentDTO, user: IUser) {
    const comment = await this.findOne(id);

    const author = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
    };

    const repliedComment = await this.commentModel.create({
      ...replyCommentDto,
      author,
      parentCommentId: id,
      postId: comment.postId
    });

    await this.commentModel.findByIdAndUpdate(id, { $push: { replies: repliedComment._id } });

    return repliedComment;
  }

  async likeComment(id: string, userId: any): Promise<Comment> {
    const comment = await this.findOne(id);

    const likeIndex = comment.likes.findIndex(like => {
      // Nếu like là object (đã populate)
      if (typeof like === 'object' && '_id' in like) {
        return like._id.toString() === userId.toString();
      }
      // Nếu like là ObjectId (chưa populate)
      return like.toString() === userId.toString();
    });

    if (likeIndex === -1) {
      // Add like
      comment.likes.push(userId);
    } else {
      // Remove like
      comment.likes.splice(likeIndex, 1);
    }

    return await this.commentModel.findByIdAndUpdate(
      id,
      comment,
      {
        new: true,
        populate: {
          path: 'likes',
          select: 'name email avatar _id'
        }
      }
    );
  }

  // Lấy comments theo postId
  async findByPostId(postId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.commentModel
        .find({ postId, isDeleted: false, parentCommentId: null }) // Chỉ lấy comments gốc
        .sort({ createdAt: -1 })
        .skip(skip)
        .populate({
          path: 'likes',
          select: 'name email avatar _id'
        })
        .populate({
          path: 'replies',
          select: 'content author createdAt likes'
        })
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments({ postId, isDeleted: false, parentCommentId: null }),
    ]);

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        pages: Math.ceil(total / limit),
        total
      },
      result: comments
    };
  }

  // Lấy replies của một comment
  async getReplies(commentId: string) {
    return this.commentModel
      .find({ parentCommentId: commentId, isDeleted: false })
      .sort({ createdAt: 1 })
      .populate({
        path: 'likes',
        select: 'name email avatar _id'
      })
      .exec();
  }
} 