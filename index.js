import express from 'express'
import mongoose from 'mongoose'
import fs from 'fs'
import multer from 'multer'
import cors from 'cors'

import { registerValidaton, loginValidaton, postCreateValidation } from './validations.js'

import { handleValidationErrors, checkAuth } from './utils/index.js'

import { UserController, PostController, CommentController } from './controllers/index.js'

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Database OK'))
  .catch((err) => console.log('Database error', err))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())

app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidaton, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidaton, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/users', UserController.getAllUsers)
app.get('/users/:id', UserController.getOneUser)

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.get('/posts/user/:id', PostController.getUserPosts)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
)

app.get('/comments/:id', CommentController.getPostComments)
app.post('/comments', checkAuth, CommentController.create)
app.delete('/comments/:id', checkAuth, CommentController.remove)

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server OK')
})
