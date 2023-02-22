import mongoose, { Schema } from 'mongoose'
import { User } from './User'

export interface Post extends Document {
  imageUrl: string
  description: string
  tags: []
  viewsCount: number
  likes: number
  user: User
}

const PostSchema = new mongoose.Schema<Post>(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tags: {
      type: Schema.Types.Mixed,
      default: {},
    },
    viewsCount: {
      type: Number,
      default: 0,
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
  },
  { timestamps: true },
)

export default mongoose.model<Post>('Post', PostSchema)
