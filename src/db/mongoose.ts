import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ path: './config/config.env' })

const connectDB = async () => {
  try {
    const MONGODB_URI_LOCAL: string = `${process.env.MONGODB_URI_LOCAL}`

    const conn = await mongoose.connect(MONGODB_URI_LOCAL)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDB
