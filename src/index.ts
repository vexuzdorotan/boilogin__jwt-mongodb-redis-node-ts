import express, { json } from 'express'
import dotenv from 'dotenv'

import connectDB from './db/mongoose'

import userRouter from './routers/userRouter'

dotenv.config({ path: './config/config.env' })
connectDB()

const app = express()

const PORT = process.env.PORT || 3000

app.use(json())

app.use('/api/users', userRouter)

app.listen(PORT, () => {
  console.log(`🚀 Server is up on port ${PORT}.`)
})
