import {Router} from 'express';
import authController from '../controllers/auth-controller.js';
import settingController from '../controllers/setting-controller.js';
const settingRouter = Router()

//middleware for protecting routes 
settingRouter.use(authController.protect)

//change password
settingRouter.route('/change-password')
.patch(settingController.changePassword)

// logout account
settingRouter.route('/logout')
.get(settingController.logout)

// account details
settingRouter.route('/account-details')
.get(settingController.accountDetails)

// delete account
settingRouter.route('/delete-account')
.delete(settingController.deleteAccount)


export default settingRouter;