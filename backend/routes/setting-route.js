import {Router} from 'express';
import authController from '../controllers/auth-controller.js';
import settingController from '../controllers/setting-controller.js';
import transactionController from '../controllers/transaction-controller.js';
const settingRouter = Router()

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
.get(settingController.logout)

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


export default settingRouter;