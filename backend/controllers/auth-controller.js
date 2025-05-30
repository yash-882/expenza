import CustomError from "../errors/custom-error-class.js";
import userModel from "../models/user-model.js";
import sendResponse from "../utils/functions/api-response.js";
import bcrypt from 'bcrypt';
import nodemailer from "../utils/functions/nodemailer/nodemailer.js";
import { decodeToken, exchangeJWT, signRefreshJWT, signAccessJWT, verifyAccessJWT } from "../utils/functions/jwt/jwt-auth.js";
import OTPModel from "../models/otp-model.js";
import jwt from "jsonwebtoken";

// wrapper for reusability
function wrapper(controller) {
    return async (req, res, next) => {
        try {
            // results
            await controller(req, res, next);
        } catch (err) {
            // throws error to global error handler
            next(err)
        }
    }
}
// Authenticate user by checking if the credentials are correct
const authenticateUser = wrapper(async (req, res, next) => {

    // inputs
    const enteredCredentials = req.body;
    // checks if username/password is missing in the body
    const credentialMissing = !enteredCredentials.password || !enteredCredentials.email;

    // send error response on validation
    if (credentialMissing) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Email or Password is required',
        }, 400))
    }

    // looking up for the user in DB
    let user = await userModel.findOne({ email: req.body.email })

    // if no user with the provided username exists in DB 
    if (!user)
        return next(new CustomError({
            name: 'NotFoundError',
            message: "The Email is incorrect or not registered with us",
        }, 404))

    // user exists
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    // is password correct?
    if (!isPasswordCorrect) {
        // unauthenticated
        return next(new CustomError({
            name: 'UnauthorizedError',
            message: 'Incorrect Password'
        }, 401))
    }

    // request is authenticated (user can login now)
    req.user = user
    next()
})

// response of successful login after authentication
const loginUser = wrapper(async (req, res, next) => {
    //user after authentication is successful
    const user = req.user;

    const ACCESS_TOKEN = signAccessJWT({ id: user._id }); //access token
    const REFRESH_TOKEN = signRefreshJWT({ id: user._id }); //refresh token

    // Access token (short lived)
    res.cookie('AT', ACCESS_TOKEN,{
        httpOnly: true, //prevent cookie from client-side access via JS
        maxAge: 15 * 60 * 1000 //15 mins
    })

    // Refresh token (expires in 20 days)
    res.cookie('RT', REFRESH_TOKEN,{
        httpOnly: true, //prevent cookie from client-side access via JS
        maxAge: 20 * 24 * 60 * 60 * 1000 //20days
    })

    return sendResponse(res, {
        message: 'You have logged in to your account',
        statusCode: 200
    })
})

// checks if the user is already logged in
// THIS WILL SEND EITHER A GOOD RESPONSE OR ALLOW THE USER TO LOGIN
const isAlreadyLoggedIn = wrapper((req, res, next) => {
    // extract token
    const bearerToken = req.headers.authorization;
    // if the request is new
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
        //clear tokens from cookies section, if exist
        res.clearCookie('AT', { httpOnly: true })
        res.clearCookie('RT', { httpOnly: true })
        return next()
    }

    // access token
    const token = bearerToken.split(' ')[1]
    
    // THE CUSTOM JWT MODULE CAN THROW ERROR AND CALL THE GlobalErrorHandler
    //TO AVOID CALLING THE GlobalErrorHandler, nested try catch block is used
    try {
        // returns an err object or decoded token (except expiration error)
        const result = verifyAccessJWT(token);

        // is token expired?
        if (result.name == 'TokenExpiredError') {
            const refreshToken = req.cookies.RT
            // will throw err if Refresh token is also expired or invalid
            if (!refreshToken) {
                res.clearCookie('AT')
                // user have to login again
                return next();
            }

            // returns a new JWT or throw error
            const newToken = exchangeJWT(token, refreshToken)
            res.cookie('AT', newToken) //store in cookies
        }
        // user is already logged in
        return sendResponse(res, {
            statusCode: 200,
            message: 'You are already logged in',
        })
    }
    catch (err) {
        //allowing the user to go to /login
        res.clearCookie('AT', { httpOnly: true }) //delete Access Token from cookies section
        res.clearCookie('RT', { httpOnly: true }) //delete Refresh Token from cookies section

        return next();
    }
})

// reset password via OTP
const resetPassword = wrapper(async (req, res, next) => {
    const user = req.body;

    // no email is provided
    if (!user || !user.email) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Email is required'
        }), 400)
    }

    // checks if user is registered 
    const userInDB = await userModel.findOne({ email: user.email })


    // if doesn't exist
    if (!userInDB) {
        return next(new CustomError({
            name: 'NotFoundError',
            message: "The Email is incorrect or not registered with us"
        }, 404))
    }
    //generate 6 digits OTP
    const OTP = Math.floor(Math.random() * 900000) + 100000;

    // hashed password
    const hashedOTP = await bcrypt.hash(String(OTP), 12)

    const isAlreadyRequested = await OTPModel.findOne({ email: user.email })

    // if user has already requested an OTP
    if (isAlreadyRequested) {
        // overwrite the old requested OTP with the new one
        await OTPModel.updateOne({ email: userInDB.email }, { '$set': { otp: hashedOTP } })

        // sending OTP...
        await sendOTP(OTP, userInDB.email)  
    }

    // 1st request of requesting OTP
    else {
        // store OTP in DB
        await OTPModel.create({ email: userInDB.email, otp: hashedOTP })
        // sending OTP... 
        await sendOTP(OTP, userInDB.email)
    }

    // sign token to identify email
    const token = jwt.sign({
        email:userInDB.email,
        type:'email-identifier'
    }, process.env.JWT_SECKEY_AT,
{expiresIn: '5m'})

    //storing Email is cookies to remember who requested the otp
    res.cookie('reset_pass_token1', token,{
        httpOnly: true,
        maxAge: 10 * 60 * 1000 //expires in 10 minutes
    })

    sendResponse(res, {
        statusCode: 201,
        message: 'OTP has been sent to your Email'
    })
})

// validate OTP
const validateOTP = wrapper(async (req, res, next) => {
    const OTPDetails = req.body;
    // no otp is provided
    if (!OTPDetails || !OTPDetails.otp) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Please enter OTP!'
        }, 400))
    }
    
    // getting email from cookies to identify the client who requested the OTP
    const token = req.cookies.reset_pass_token1
    // if the user never requested the OTP
    if(!token){
         return next(new CustomError({
            name: 'NotFoundError',
            message: 'Session has been expired, please restart the password reset process'
        }, 404))
    }
    
    // throws error and call GlobalErrhHandler except expiration error or decoded token
    const result = verifyAccessJWT(token)
    
    // entered OTP
    const enteredOTP = OTPDetails.otp;
    
    // query OTP document
    const OTPInDB = await OTPModel.findOne({ email: result.email })
    
    // OTP expires
    if (result.name == 'TokenExpiredError' || !OTPInDB) {
        // remove token from cookies
        res.clearCookie('reset_pass_token1', {httpOnly:true})
        return next(new CustomError({
            name: 'NotFoundError',
            message: 'The OTP has been expired, please request a new one.'
        }, 404))
    }
    
    // compare the hashed one with plain OTP text entered by user
    const isOTPCorrect = await bcrypt.compare(enteredOTP, OTPInDB.otp)
    
    // Incorrect OTP
    if (!isOTPCorrect) {
        return next(new CustomError({
            name: 'UnauthorizedError',
            message: 'Incorrect OTP!'
        }, 401))
    }
    
    // sign token for changing the Password
    const OTPToken = jwt.sign({
        email: result.email,
        type: 'otp',
    }, process.env.JWT_SECKEY_AT, {
        expiresIn:'5m' 
    })
    
    // cookie for /change-password indicates that the OTP has been verified
    res.cookie('reset_pass_token2', OTPToken, {
        httpOnly: true,
        maxAge: 5 * 60 * 1000 //5 minutes
    })
    // OTP was correct
    sendResponse(res, {
        statusCode: 201,
        message: 'Your OTP was correct'
    })
})

// send OTP to user's Email
const sendOTP = async (OTP, email) => {
    // sending...
    await nodemailer.sendMail({
        from: `Expenza <${process.env.GMAIL}>`, //app's name
        subject: 'Reset Password',
        to: email, //receiver Email

        html: `<p style='font-size:16px;'>
        Your OTP for resetting the Password is <b style='font-size:20px;'>
        ${OTP}
        </b></p>`
    })
}

const changePassword = wrapper(async (req, res, next) => {
    const token = req.cookies.reset_pass_token2;

    // throws error except expiration error or decoded token
    const result = token ? verifyAccessJWT(token) : undefined;

    // checks if the token is expired
    const isTokenExpired = result && result.name == 'TokenExpiredError';

      if(!result || isTokenExpired){
         return next(new CustomError({
            name: 'NotFoundError',
            message: 'Session has been expired, please restart the password reset process'
        }, 404))
    }

    // getting new credentials
    const credentials = req.body;
    
    if(!credentials.password || !credentials.confirmPassword){
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Please enter Password or confirm Password correctly'
        }, 400))
    }
    
    // compare re-entered password with the actual one
    if(credentials.password != credentials.confirmPassword){
         return next(new CustomError({
            name: 'BadRequestError',
            message: 'Please confirm your Password correctly'
        }, 400))
    }

    const user = await userModel.findOne({email: result.email})
    
    // checks if the new entered Password is not different from the Password stored in DB
    const isPasswordSame = await bcrypt.compare(credentials.password, user.password)
    
    if(isPasswordSame){
        return next(new CustomError({
            message: 'New Password must be different from the previous one'
        }))
    }

    // hashing the new Password...
    const hashedPassword = await bcrypt.hash(credentials.password, 12)

    // updating Password...
    await userModel.updateOne({email: result.email}, {'$set': {password: hashedPassword}})

    // clear tokens after updation
    res.clearCookie('reset_pass_token1', {httpOnly: true})
    res.clearCookie('reset_pass_token2', {httpOnly: true})

    // Delete OTP document after updation...
    await OTPModel.deleteOne({email: result.email})

    sendResponse(res, {
        message: 'The Password has been updated. You can use your new Password now.'
    })
})

// protect routes
const protect = wrapper(async (req, res, next) => {
    // extract token
    const bearerToken = req.headers.authorization;

    // if does not start with 'Bearer'
    if (!(bearerToken && bearerToken.startsWith('Bearer '))) {
        return next(new CustomError({
            name: 'UnauthorizedError',
            message: 'You are not authorized to this page. Please login'
        }, 401))
    }

    // extract jwt token
    const token = bearerToken.split(' ')[1]

    //returns the decoded token or throws errors except TokenExpiredError
    let jwtData = verifyAccessJWT(token);

    // is token expired?
    if (jwtData.name == 'TokenExpiredError') {
        const refreshToken = req.cookies.RT

        if(!refreshToken){
            res.clearCookie('AT', {httpOnly: true})
              return next(new CustomError({
            name: 'UnauthorizedError',
            message: 'You are not authorized to this page. Please login'
        }, 401))
        }
        // will throw err if Refresh token is also expired or invalid
        const newToken = exchangeJWT(token, refreshToken) //returns new Access token
        res.cookie('AT', newToken) //store in cookies

        // new user's token   
        jwtData = decodeToken(newToken)
    }

    let userInDB = await userModel.findById(jwtData.id)

    if(!userInDB){
        // clear tokens
        res.clearCookie('AT', {httpOnly: true})
        res.clearCookie('RT', {httpOnly: true})
        return next(new CustomError({
            name: 'NotFoundError',
            message: 'The profile is not found.'

        }, 404))
    }

    // user is authorized
    req.user = userInDB
    next()
})

// Sign up 
const createUser = wrapper(async (req, res, next) => {
    // if body is not provided
    if (!req.body || Object.keys(req.body).length == 0)
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Form body is required!'
        }))

    // create user
    const newUser = await userModel.create(req.body)
    // remove password from response
    newUser.password = undefined

    sendResponse(res, {
        statusCode: 201,
        message: 'The user has been created',
        data: newUser
    })
})

export default {
    createUser,
    loginUser,
    authenticateUser,
    protect,
    isAlreadyLoggedIn,
    validateOTP,
    resetPassword,
    changePassword
}