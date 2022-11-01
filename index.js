import express from 'express'
import mongoose from 'mongoose'

import { registerValidaton } from './validations/auth.js'
import { mongodbLink } from './variables.js'
import checkAuth from './utils/checkAuth.js'

import * as UserController from './controllers/UserController'

mongoose
  .connect(mongodbLink)
  .then(() => console.log('Database OK'))
  .catch((err) => console.log('Database error', err))

const app = express()

app.use(express.json())

app.post('/auth/login', UserController.login)

app.post('/auth/register', registerValidaton, UserController.register)

app.get('/auth/me', checkAuth, UserController.getMe)

app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server OK')
})
