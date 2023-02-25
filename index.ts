import express, { Application } from 'express'
import mongoose from 'mongoose'
import fs from 'fs'
import multer from 'multer'
import cors from 'cors'

import { registerValidaton, loginValidaton, postCreateValidation } from './validations.js'
import { handleValidationErrors, checkAuth } from './utils/index.js'
import { UserController, PostController, CommentController } from './controllers/index.js'

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Database OK'))
  .catch((err) => console.log('Database error', err))

const app: Application = express()

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
  destination: (_: Express.Request, __: Express.Multer.File, cb: DestinationCallback): void => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (_: Express.Request, file: Express.Multer.File, cb: FileNameCallback) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())

app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidaton, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidaton, handleValidationErrors, UserController.register)
//@ts-ignore
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/users', UserController.getAllUsers)
app.get('/users/:id', UserController.getOneUser)

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file?.originalname}`,
  })
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.get('/posts/user/:id', PostController.getUserPosts)
//@ts-ignore
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
//@ts-ignore
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
  '/posts/:id',
  //@ts-ignore
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
)

app.get('/comments/:id', CommentController.getPostComments)
//@ts-ignore
app.post('/comments', checkAuth, CommentController.create)
//@ts-ignore
app.delete('/comments/:id', checkAuth, CommentController.remove)

app.listen(process.env.PORT || 4444, () => {
  console.log('Server OK')
})
