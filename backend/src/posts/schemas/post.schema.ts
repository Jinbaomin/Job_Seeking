import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Comment } from "src/comments/schemas/comment.schema";
import { User } from "src/users/schemas/users.schema";

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  content: string;

  @Prop({ type: [String] })
  images?: string[];

  @Prop({ type: Object, required: true })
  author: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    avatar?: string;
  };

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name, default: [] })
  likes: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Comment.name , default: [] })
  comments: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop({ type: Object })
  deletedBy?: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post); 