import {Router} from 'express';
import authController from '../controllers/auth-controller.js';
import settingController from '../controllers/setting-controller.js';
import transactionController from '../controllers/transaction-controller.js';
const settingRouter = Router()

//middleware for protecting routes 
settingRouter.use(authController.protect)

//change password
settingRouter.route('/change-password')
.patch(settingController.changePassword)

//verify email
settingRouter.route('/verify-email')
.post(authController.limitOTPRequests, settingController.verifyNewEmail)

//validate and change email
settingRouter.route('/change-email')
.patch(authController.limitOTPAttempts, settingController.changeEmail)

// logout account
settingRouter.route('/logout')
.post(settingController.logout)

// account details
settingRouter.route('/account-details')
.get(settingController.accountDetails)

// delete account
settingRouter.route('/delete-account')
.delete(settingController.deleteAccount)

// clear all transactions
settingRouter.route('/clear-all-transactions')
.delete(transactionController.deleteTransactions)

// set monthly budget
settingRouter.route('/set-budget')
.patch(settingController.setBudget)

// change name
settingRouter.route('/change-name')
.patch(settingController.changeName)

// view transaction status
settingRouter.route('/transaction-status')
.get(settingController.transactionStatus)

// verify password (for confirmation before sensitive actions)
settingRouter.route('/verify-password')
.post(settingController.verifyPassword)


export default settingRouter;