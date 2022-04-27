import { RequestHandler } from 'express'
import * as argon2 from 'argon2'

import User from '../models/userModel'

const createUser: RequestHandler = async (req, res, next) => {
  try {
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

const loginUser: RequestHandler = async (req, res, next) => {
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

const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user
    const token = res.locals.token

    user.tokens = user.tokens.filter((i: any) => i.token !== token)

    await user.save()

    res
      .status(200)
      .send({ message: `Logout successfully.` })
  } catch (error) {
    res.status(500).send(error)
  }
}

const logoutUserToAllDevices: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user

    user.tokens = []

    await user.save()

    res
      .status(200)
      .send({ message: `Logged out to all devices successfully.` })
  } catch (error) {
    res.status(500).send(error)
  }
}

const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find({}, '-_id name email')

    res.status(200).send(users)
  } catch (error) {
    res.status(400).send(error)
  }
}

const getMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user

    res.status(200).send({ user })
  } catch (error) {
    res.status(404).send(error)
  }
}

export { createUser, loginUser, logoutUserToAllDevices, getMyProfile, getAllUsers }
