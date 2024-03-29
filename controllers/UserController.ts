import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import UserModel from '../models/User'
import { UserDocument } from '../types'

export const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.password

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    })

    const user = (await doc.save()) as UserDocument

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret',
      {
        expiresIn: '30d',
      },
    )

    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to register',
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.findOne({ email: req.body.email })) as UserDocument

    if (!user) {
      return res.status(404).json({
        message: 'Failed to authorize',
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Invalid login or password',
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret',
      {
        expiresIn: '30d',
      },
    )

    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to authorize',
    })
  }
}

export const getMe = async (req: any, res: Response) => {
  try {
    const user = (await UserModel.findById(req.userId)) as UserDocument

    if (!user)
      return res.status(404).json({
        message: 'User not found',
      })

    const { passwordHash, ...userData } = user._doc

    res.json(userData)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'No access',
    })
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().exec()

    res.json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get users',
    })
  }
}

export const getOneUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id

    const user = await UserModel.findById(userId).exec()
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get user',
    })
  }
}
