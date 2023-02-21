import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tags: {
      type: Array,
      default: [],
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

export default mongoose.model('Post', PostSchema)
