import mongoose from 'mongoose'

import { Post } from './Post'
import { User } from './User'

interface Comment extends Document {
  text: string
  likes: number
  user: User
  post: Post
}

const CommentSchema = new mongoose.Schema<Comment>(
  {
    text: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model<Comment>('Comment', CommentSchema)
