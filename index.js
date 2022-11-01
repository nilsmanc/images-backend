import express from 'express'
import mongoose from 'mongoose'
import { registerValidaton } from './validations/auth.js'
import { mongodbLink } from './variables.js'
import { validationResult } from 'express-validator'

mongoose
  .connect(mongodbLink)
  .then(() => console.log('Database OK'))
  .catch((err) => console.log('Database error', err))

const app = express()

app.use(express.json())

app.post('/auth/register', registerValidaton, (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  res.json({ success: true })
})

app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server OK')
})
