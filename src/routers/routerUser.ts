import { Router } from 'express'

import { getAllusers, createUser } from '../controllers/controllerUser'

const router = Router()

router.route('/').get(getAllusers).post(createUser)

export default router
