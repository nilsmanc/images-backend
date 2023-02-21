import { body } from 'express-validator'

export const loginValidaton = [
  body('email', 'Invalid mail format').isEmail(),
  body('password', 'Password must be at least 5 symbols').isLength({ min: 5 }),
]

export const registerValidaton = [
  body('email', 'Invalid mail format').isEmail(),
  body('password', 'Password must be at least 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Specify the name').isLength({ min: 2 }),
  body('avatarUrl', 'Invalid link').optional(),
]

export const postCreateValidation = [
  body('imageUrl', 'Invalid link').isString(),
  body('description', 'Enter the text').isLength({ min: 1 }),
  body('tags', 'Invalid tags format').optional().isString(),
]
