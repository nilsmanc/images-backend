import { Request, Response } from 'express'

import PostModel from '../models/Post'

export const getLastTags = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().limit(5).exec()

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5)

    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get tags',
    })
  }
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get posts',
    })
  }
}

export const getOne = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'Failed to return the post',
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Post not found',
          })
        }
        res.json(doc)
      },
    ).populate('user')
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get posts',
    })
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err: Error, doc: Document) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'Failed to delete the post',
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Post not found',
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
      message: 'Failed to get posts',
    })
  }
}

export const create = async (req: any, res: Response) => {
  try {
    const doc = new PostModel({
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      tags: req.body.tags?.split(','),
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to create the post',
    })
  }
}

export const update = async (req: any, res: Response) => {
  try {
    const postId = req.params.id

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        tags: req.body.tags,
        user: req.userId,
      },
    )

    res.json({
      success: true,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to update the post',
    })
  }
}

export const getUserPosts = async (req: Request, res: Response) => {
  const userId = req.params.id

  try {
    const posts = await PostModel.find({ user: { _id: userId } }).exec()

    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get posts',
    })
  }
}
