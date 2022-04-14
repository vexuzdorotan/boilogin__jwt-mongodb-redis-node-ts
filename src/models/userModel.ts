import mongoose, { Schema } from 'mongoose'
import IUser from '../interface/userInterface'

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model<IUser>('User', userSchema)
