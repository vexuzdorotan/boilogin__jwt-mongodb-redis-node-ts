import { Router } from 'express'

import {
  loginUser,
  getAllusers,
  createUser,
} from '../controllers/userController'

const router = Router()

router.route('/login').post(loginUser)

router.route('/').get(getAllusers).post(createUser)

export default router
