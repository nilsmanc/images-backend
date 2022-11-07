import CommentModel from '../models/Comment.js'

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: req.body.postId,
    })

    const comment = await doc.save()

    res.json(comment)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to create the comment',
    })
  }
}

export const getPostComments = async (req, res) => {
  const postId = req.params.id
  try {
    const comments = await CommentModel.find({ post: { _id: postId } }).populate('user')

    res.json(comments)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get comments',
    })
  }
}
