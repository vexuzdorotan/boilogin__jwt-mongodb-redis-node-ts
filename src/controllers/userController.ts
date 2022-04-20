import { RequestHandler } from 'express'
import * as argon2 from 'argon2'

import User from '../models/userModel'

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

    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
}

export const loginUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body

  const defaultErrorMsg = `User with email ${email} doesn't exist.`

  try {
    const user = await User.findOne({ email })

    if (!user) return res.status(404).send({ error: defaultErrorMsg })

    const validPassword = await argon2.verify(user.password, password)

    if (!validPassword)
      return res.status(404).send({ error: `Password is incorrect.` })

    const token = await user.generateAuthToken()

    res.status(200).send({
      message: 'Logged in successfully.',
      user: { name: user.name, email: user.email, token },
    })
  } catch (error) {
    res.status(401).send({ error: defaultErrorMsg })
  }
}

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find()

    res.status(200).send(users)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const getMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const _id = res.locals._id

    const user = await User.findOne({ _id }, 'name email tokens')

    res.status(200).send({ user })
  } catch (error) {
    res.status(404).send(error)
  }
}

export const logoutToAllDevices: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user)
      return res
        .status(404)
        .send({ error: `User with email ${email} doesn't exist.` })

    user.tokens = []

    await user.save()

    res
      .status(200)
      .send({ message: `${email} logged out to all devices successfully.` })
  } catch (error) {
    res.status(500).send(error)
  }
}
