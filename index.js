import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { mongodbLink } from './variables.js'

mongoose
  .connect(mongodbLink)
  .then(() => console.log('Database OK'))
  .catch((err) => console.log('Database error', err))

const app = express()

app.use = express.json()

app.post('/auth/login', (req, res) => {
  console.log(req.body)

  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: 'Name Surname',
    },
    'secret',
  )
  res.json({
    success: true,
    token,
  })
})

app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server OK')
})
