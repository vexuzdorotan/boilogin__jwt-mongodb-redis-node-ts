import { Router } from 'express'

import auth from '../middlewares/auth'

import {
  createUser,
  loginUser,
  getAllusers,
  getMyProfile,
} from '../controllers/userController'

const router = Router()

router.route('/login').post(loginUser)

router.route('/me').get(auth, getMyProfile)

router.route('/').get(getAllusers).post(createUser)

export default router
