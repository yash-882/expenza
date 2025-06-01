import { Router } from 'express'
import authController from '../controllers/auth-controller.js'
import transactionController from '../controllers/transaction-controller.js'
const transactionRouter = Router()

// use middleware to protect routes
transactionRouter.use(authController.protect)

// get all transactions
transactionRouter.route('/')
.get(transactionController.getTransactions)

// delete all
transactionRouter.route('/delete')
.delete(transactionController.deleteTransactions)

// create transactions
transactionRouter.route('/create')
.post(transactionController.createTransaction)

// actions by ID
transactionRouter.route('/:id')
.get(transactionController.getTransactionByID)
.patch(transactionController.updateTransactionByID)
.delete(transactionController.deleteTransactionByID)


export default transactionRouter