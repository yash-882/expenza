import {Router} from 'express';
import authController from '../controllers/auth-controller.js';
const settingRouter = Router()

//middleware for protecting routes 
settingRouter.use(authController.protect)
settingRouter.use(authController.protect)




// accountSettingRouter.route('/change-email')
// .patch()

// accountSettingRouter.route('/delete-account')
// .delete()

// accountSettingRouter.route('/logout')
// .post()


export default settingRouter;