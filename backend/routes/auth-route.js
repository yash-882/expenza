import {Router} from "express";
import authController from "../controllers/auth-controller.js";
const authRouter = Router();

// sign-up
authRouter.route('/sign-up')
.post(authController.createUser)

// login user after authentication is successful
authRouter.route('/login')
.post(authController.isAlreadyLoggedIn,
    authController.authenticateUser, 
    authController.loginUser)

authRouter.route('/reset-password-otp')
.get(authController.resetPassword)

authRouter.route('/reset-password-otp/submit')
.get(authController.validateOTP)

export default authRouter

