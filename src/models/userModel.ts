import { Schema, model } from 'mongoose'
import jwt from 'jsonwebtoken'

import IUser from '../interfaces/userInterface'

const userSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const JWT_SECRET_KEY: string = `${process.env.JWT_SECRET_KEY}`

  console.log({ user, JWT_SECRET_KEY })

  const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
    expiresIn: '2m',
  })

  user.tokens = user.tokens.concat({ token })
  console.log(user.tokens)
  await user.save()

  return token
}

export default model<IUser>('User', userSchema)
