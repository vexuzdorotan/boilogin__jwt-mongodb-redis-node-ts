import { RequestHandler } from 'express'
import * as argon2 from 'argon2'

import User from '../models/userModel'

export const loginUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body

  const defaultErrorMsg = `User with email ${email} doesn't exist.`

  try {
    const user = await User.findOne({ email })

    if (!user) return res.status(404).send({ error: defaultErrorMsg })

    const validPassword = await argon2.verify(user.password, password)

    if (!validPassword)
      return res.status(404).send({ error: `Password is incorrect.` })

    res.status(200).send({
      message: 'Logged in successfully.',
      user: { name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(401).send({ error: defaultErrorMsg })
  }
}

export const getAllusers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find()

    res.status(200).send(users)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    // console.log(req.body)

    const { name, email, password } = req.body

    const isEmailExisted = await User.findOne({ email })

    if (isEmailExisted)
      return res
        .status(400)
        .send({ error: `Email '${email}' already existed.` })

    const hashedPasword = await argon2.hash(password)

    const user = new User({
      name,
      email,
      password: hashedPasword,
    })

    await user.save()
    res.status(201).send({ user })
  } catch (error) {
    res.status(400).send(error)
  }
}
