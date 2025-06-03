import CustomError from "../errors/custom-error-class.js";
import userModel from "../models/user-model.js";
import sendResponse from "../utils/functions/api-response.js";
import bcrypt from 'bcrypt';
import nodemailer from "../utils/functions/nodemailer/nodemailer.js";
import { decodeToken, exchangeJWT, signRefreshJWT, signAccessJWT, verifyAccessJWT, verifyRefreshJWT } from "../utils/functions/jwt/jwt-auth.js";
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

    // THE CUSTOM JWT MODULE CAN THROW ERROR AND CALL THE GlobalErrorHandler
    //TO AVOID CALLING THE GlobalErrorHandler, nested try catch block is used

    try {
        const accessToken = req.cookies.AT;

        // returns an err object(except expiration error) or decoded token
        const token = accessToken ? verifyAccessJWT(accessToken) : undefined;

        // is token expired / missing?
        if (!token || token.name == 'TokenExpiredError') {
            const refreshToken = req.cookies.RT
            // will throw err if Refresh token is also expired or invalid
            if (!refreshToken) {
                res.clearCookie('AT', {httpOnly:true})
                // user have to login again
                return next();
            }

        let newAccessToken;

        // access token is not provided
        if(!token){
            // will throw err if Refresh token is also expired or invalid
        let payload = verifyRefreshJWT(refreshToken) //returns payload

        // signing access token...
        newAccessToken = signAccessJWT({id: payload.id})
        }

        // access token is provided
         else
        newAccessToken = exchangeJWT(token, refreshToken)

           //store in cookies 
            res.cookie('AT', newAccessToken, {
                httpOnly: true, 
                maxAge: 15 * 60 * 1000 //15 minutes
            }) 
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

// temporary block OTP request if user exceeded the limit
// (it's just a helper function that avoids DB queries of requestCount in resetPassword,
//the initiatial block of request happens in resetPassword itself)
const limitOTPRequests = wrapper(async (req, res, next) => {
    // token that temporarily block OTP requests 
    const limitRequestsToken = req.cookies.OTP_requests;

// if user is temporarily blocked from requesting OTPs
    if (limitRequestsToken) {
        //throws errors except the expiration error or returns a decoded token
        const validationResult = verifyAccessJWT(limitRequestsToken)

        // user can request again
        if (validationResult.name === 'TokenExpiredError') {
            res.clearCookie('OTP_requests', {httpOnly:true})

            //user can now request again
            return next()
        }
        
        return next(new CustomError({
            name: 'TooManyRequests',
            message: 'Too many OTP requests. Try again later.'
        }))
    }

    // first request attempt
    next()
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

    const isAlreadyRequested = await OTPModel.findOne({ email: user.email })
    
    if(isAlreadyRequested && isAlreadyRequested.requestCount >= 5){

        // once the user is out of OTP request attempts, we avoid DB queries for requestCount
        // and assign a token indicates that the OTP validation is not allowed for 5 minutes
          const requestAttempts = jwt.sign({ type: 'limit-otp-requests' },
            process.env.JWT_SECKEY_AT,
            { expiresIn: '5m' })

        // store token
        res.cookie('OTP_requests', requestAttempts,
            {httpOnly:true, maxAge: 5 * 60 * 1000 } //5 minutes
        )

        return next(new CustomError({
            name: 'TooManyRequests',
            message: 'Too many OTP requests. Try again later.'
        }))
    }
    
    // hashed password
    const hashedOTP = await bcrypt.hash(String(OTP), 12)

    // if user has already requested an OTP
    if (isAlreadyRequested) {
        // overwrite the old requested OTP with the new one
        await OTPModel.updateOne({ email: userInDB.email },
            {
                '$set': { otp: hashedOTP },
                '$inc': { requestCount: 1 }
            })
            
            // sending OTP...
            await sendOTP(OTP, userInDB.email)
        }
        
        // 1st request of requesting OTP
        else {
            // store OTP in DB
            await OTPModel.create({ 
                email: userInDB.email, 
                otp: hashedOTP,
            })
            // sending OTP... 
            await sendOTP(OTP, userInDB.email)
        }
        
        // sign token to identify email
        const token = jwt.sign({
            email: userInDB.email,
            type: 'email-identifier'
        }, process.env.JWT_SECKEY_AT,
        { expiresIn: '10m' })

    //storing Email is cookies to remember who requested the otp
    res.cookie('OTP_validation', token, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000 //expires in 10 minutes
    })

    sendResponse(res, {
        statusCode: 201,
        message: 'OTP has been sent to your Email'
    })
})

const limitOTPAttempts = wrapper(async (req, res, next) => {
    
    // token that allows validation process of an OTP
    const validationToken = req.cookies.OTP_validation
    //throws errors except the expiration error or returns a decoded token
    const validationResult = validationToken ? verifyAccessJWT(validationToken) : undefined
    
    // returning same response on both token expiration 
    // and if no validation token(cookie) is provided
    if (!validationResult || (validationResult && validationResult.name == 'TokenExpiredError')) {
        return next(new CustomError({
            name: 'NotFoundError',
            message: 'Session has been expired. Please restart the password reset process.'
        }, 404))
    }
    
 
    // check if user is temporarily blocked from OTP validation
    const limitAttemptsToken = req.cookies.OTP_Attempts;

    if(limitAttemptsToken){
       const attemptsResult = verifyAccessJWT(limitAttemptsToken)

    //    if expired.. means user can now make attemps again
       if(attemptsResult.name === 'TokenExpiredError'){
        // allow user to try atempts again
        res.clearCookie('OTP_Attempts', {httpOnly: true})
       } 
    //    user is still not allowed to the validation process
       else{ 
        return next(new CustomError({
            name: 'TooManyRequests',
            message: 'You have reached the limit for OTP attempts. Try again later.'
        }, 429))
       }
}

    // querying to check the expiration
    const OTPInDB = await OTPModel.findOne({ email: validationResult.email })
    
    // if OTP is expired
    if (!OTPInDB) {

        return next(new CustomError({
            name: 'NotFoundError',
            message: 'OTP has been expired. Please request a new one.'
        }, 404))
    }

    // user is out of attempts
    if (OTPInDB && OTPInDB.attemptCount >= 5) {
        // once the user is out of attempts, we avoid DB queries for attemptCount
        // and assign a token indicates that the OTP validation is not allowed for 5 minutes
        const OTPAttempts = jwt.sign({type:'limit-otp-attempts'}, 
            process.env.JWT_SECKEY_AT,
            {expiresIn: '5m'}
        )

        // store token
        res.cookie('OTP_Attempts', OTPAttempts, 
            {httpOnly: true},
            {maxAge: 5 * 60 * 1000 } //5 minutes
        )

        return next(new CustomError({
            name: 'TooManyRequests',
            message: 'You have reached the limit for OTP attempts. Try again later.'
        }, 429))
    }

// user has attempts
req.OTPDetails = OTPInDB;
next();
})

// validate OTP
const validateOTP = wrapper(async (req, res, next) => {
    const body = req.body;
    // no otp is provided
    if (!body || !body.otp) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Please enter OTP!'
        }, 400))
    }

    // valid OTP
    const hashedValidOTP = req.OTPDetails.otp;
    console.log(hashedValidOTP);
    
    const userEmail = req.OTPDetails.email;

    // entered OTP
    const enteredOTP = req.body.otp;

    // compare the hashed one with plain OTP text entered by user
    const isOTPCorrect = await bcrypt.compare(enteredOTP, hashedValidOTP)

    // Incorrect OTP
    if (!isOTPCorrect) {
        // update wrong attempts count
        await OTPModel.updateOne(
            {email: userEmail}, 
        {'$inc': {attemptCount:1}})

        return next(new CustomError({
            name: 'UnauthorizedError',
            message: 'Incorrect OTP!'
        }, 401))
    }

    // sign token for changing the Password
    const changePassToken = jwt.sign({
        email: userEmail,
        type: 'otp',
    }, process.env.JWT_SECKEY_AT, {
        expiresIn: '3m'
    }) 

    // cookie for /change-password indicates that the OTP has been verified
    res.cookie('change_password', changePassToken, {
        httpOnly: true,
        maxAge: 3 * 60 * 1000 //3 minutes
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
    // token that is assigned after successful OTP validation 
    const token = req.cookies.change_password;

    // throws error except expiration error or decoded token
    const validationResult = token ? verifyAccessJWT(token) : undefined;

    // checks if the token is expired
    const isTokenExpired = validationResult && validationResult.name == 'TokenExpiredError';

    if (!validationResult || isTokenExpired) {
        return next(new CustomError({
            name: 'NotFoundError',
            message: 'Session has been expired. Please restart the password reset process.'
        }, 404))
    }

    // getting new credentials
    const credentials = req.body;

    if (!credentials || !credentials.password || !credentials.confirmPassword) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Please enter all required fields'
        }, 400))
    }

    // compare re-entered password with the actual one
    if (credentials.password != credentials.confirmPassword) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Confirm your Password correctly!'
        }, 400))
    }

    const user = await userModel.findOne({ email: validationResult.email })

    // checks if the new entered Password is not different from the Password stored in DB
    const isPasswordSame = await bcrypt.compare(credentials.password, user.password)

    if (isPasswordSame) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'New Password must be different from the previous one'
        }, 400))
    }

    // hashing the new Password...
    const hashedPassword = await bcrypt.hash(credentials.password, 12)

    // updating Password...
    await userModel.updateOne({ email: validationResult.email }, 
        { '$set': { password: hashedPassword } })

    // clear tokens after updation
    res.clearCookie('OTP_validation', { httpOnly: true })
    res.clearCookie('change_password', { httpOnly: true })
    res.clearCookie('OTP_Attempts', { httpOnly: true })
    res.clearCookie('OTP_requests', { httpOnly: true })

    // Delete OTP document after updation...
    await OTPModel.deleteOne({ email: validationResult.email })

    sendResponse(res, {
        message: 'The Password has been updated. You can use your new Password now.'
    })
})

// protect routes
const protect = wrapper(async (req, res, next) => {
    // extract token
    const accessToken = req.cookies.AT;

    //returns the decoded token or throws errors except TokenExpiredError
    let token = accessToken ? verifyAccessJWT(accessToken) : undefined;

    // is token expired / missing?
    if (!token || token.name == 'TokenExpiredError') {
        const refreshToken = req.cookies.RT

        if(!refreshToken){
            res.clearCookie('AT', {httpOnly: true})
              return next(new CustomError({
            name: 'UnauthorizedError',
            message: 'You are not authorized to this page. Please login'
        }, 401))
        }

        let newAccessToken;

        // access token is not provided
        if(!token){
            // will throw err if Refresh token is also expired or invalid
        let payload = verifyRefreshJWT(refreshToken) //returns payload

        // signing access token...
        newAccessToken = signAccessJWT({id: payload.id})

        }
        // access token is provided
         else
            newAccessToken = exchangeJWT(token, refreshToken)
        
        //store new access token in cookies
        res.cookie('AT', newAccessToken, {
            httpOnly: true, 
            maxAge: 15 * 60 * 1000 //15 minutes
        }) 

        // new user's token   
        token = decodeToken(newAccessToken)
    }

    // recheck for user
    let userInDB = await userModel.findById(token.id)

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

    const ACCESS_TOKEN = signAccessJWT({ id: newUser._id }); //access token
    const REFRESH_TOKEN = signRefreshJWT({ id: newUser._id }); //refresh token

    // Access token (short lived)
    res.cookie('AT', ACCESS_TOKEN, {
        httpOnly: true, //prevent cookie from client-side access via JS
        maxAge: 15 * 60 * 1000 //15 minutes
    })

    // Refresh token (expires in 20 days)
    res.cookie('RT', REFRESH_TOKEN, {
        httpOnly: true, //prevent cookie from client-side access via JS
        maxAge: 20 * 24 * 60 * 60 * 1000 //20days
    })

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
    changePassword,
    limitOTPAttempts,
    limitOTPRequests
}