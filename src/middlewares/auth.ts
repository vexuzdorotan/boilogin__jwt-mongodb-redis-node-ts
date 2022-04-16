import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/userModel'

interface JwtPayload {
  _id: string
}

const auth: RequestHandler = async (req, res, next) => {
  const { token } = req.body

  if (!token)
    return res.status(403).send('A token is required for authentication.')

  try {
    const JWT_SECRET_KEY = `${process.env.JWT_SECRET_KEY}`

    const { _id } = <JwtPayload>jwt.verify(token, JWT_SECRET_KEY)

    const user = await User.findOne({ 'tokens.token': token })

    next()
  } catch (error) {
    res.status(401).send({ error: `Please authenticate.` })
  }
}

export default auth
