import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Object, required: true })
  author: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    avatar?: string;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  postId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  parentCommentId?: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Comment', default: [] })
  replies: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
  likes: mongoose.Schema.Types.ObjectId[];

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

export const CommentSchema = SchemaFactory.createForClass(Comment); 