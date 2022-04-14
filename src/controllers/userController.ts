import { RequestHandler } from 'express'
import userModel from '../models/userModel'

export const getAllusers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userModel.find()

    res.status(200).send(users)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    // console.log(req.body)

    const { name, email } = req.body

    const isEmailExisted = await userModel.findOne({ email })

    if (isEmailExisted)
      return res
        .status(400)
        .send({ error: `Email '${email}' already existed.` })

    const user = new userModel({
      name,
      email,
    })

    await user.save()
    res.status(201).send({ user })
  } catch (error) {
    res.status(400).send(error)
  }
}
