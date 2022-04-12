import express, { json } from 'express'
import dotenv from 'dotenv'

import connectDB from './db/mongoose'

import routerUser from './routers/routerUser'

dotenv.config({ path: './config/config.env' })
connectDB()

const app = express()

const PORT = process.env.PORT || 3000

app.use(json())

app.use('/api/users', routerUser)

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
})
