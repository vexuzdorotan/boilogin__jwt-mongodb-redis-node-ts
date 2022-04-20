import { Router } from 'express'

import auth from '../middlewares/auth'

import {
  createUser,
  loginUser,
  logoutToAllDevices,
  getAllUsers,
  getMyProfile,
} from '../controllers/userController'

const router = Router()

router.route('/login').post(loginUser)
router.route('/me').get(auth, getMyProfile)
router.route('/logoutAll').post(auth, logoutToAllDevices)

router.route('/').get(getAllUsers).post(createUser)

export default router
