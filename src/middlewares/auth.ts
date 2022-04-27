import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/userModel'

interface JwtPayload {
  _id: string
}

const auth: RequestHandler = async (req, res, next) => {
  const { token } = req.body

  // const token = req.header('Authorization')

  // console.log({ tokenTest })

  if (!token)
    return res.status(403).send('A token is required for authentication.')

  try {
    const JWT_SECRET_KEY = `${process.env.JWT_SECRET_KEY}`

    const { _id } = <JwtPayload>jwt.verify(token, JWT_SECRET_KEY)

    const user = User.findOne({ _id }).exec((err, user) => {
      if (user) {
        const result = user.tokens.some((element) => element.token === token)

        console.log(result)
      }
    })

    res.locals.token = token
    res.locals.user = user

    next()
  } catch (error) {
    res.status(401).send({ error: `Please authenticate.` })
  }
}

export default auth
