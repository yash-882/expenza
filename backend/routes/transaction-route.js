import { Router } from 'express'
import transactionController from '../controllers/transaction-controller.js'
const transactionRouter = Router()

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