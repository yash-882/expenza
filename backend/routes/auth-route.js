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

// request OTP
authRouter.route('/reset-password-otp')
.post(authController.resetPassword)

// submit OTP
authRouter.route('/reset-password-otp/submit')
.post(authController.limitOTPAttempts,
    authController.validateOTP)

// change password if OTP verification was successful
authRouter.route('/reset-password-otp/change-password')
.patch(authController.changePassword)

export default authRouter

