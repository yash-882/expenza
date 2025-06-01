import { Router } from 'express'
import authController from '../controllers/auth-controller.js'
const transactionRouter = Router()

transactionRouter.route('/')
.get(authController.protect)

transactionRouter.route('/create')
.post(authController.protect)

export default transactionRouter