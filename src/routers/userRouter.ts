import { Router } from 'express'

import { getAllusers, createUser } from '../controllers/userController'

const router = Router()

router.route('/').get(getAllusers).post(createUser)

export default router
