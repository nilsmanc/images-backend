import { Request, Response } from 'express'

import CommentModel from '../models/Comment'

export const create = async (req: any, res: Response) => {
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

export const getPostComments = async (req: Request, res: Response) => {
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

export const remove = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id

    CommentModel.findByIdAndDelete(
      {
        _id: commentId,
      },
      (err: Error, doc: Document) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'Failed to delete the comment',
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Comment not found',
          })
        }
        res.json({
          success: true,
        })
      },
    )
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get comments',
    })
  }
}
