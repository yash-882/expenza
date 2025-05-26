import {Router} from "express";
import authController from "../controllers/auth-controller.js";
const authRouter = Router();

// sign-up
authRouter.route('/sign-up')
.post(authController.createUser)

// login user after authentication is succesful
authRouter.route('/login')
.post(authController.authenticateUser, authController.loginUser)


export default authRouter

