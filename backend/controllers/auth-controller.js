import CustomError from "../errors/custom-error-class.js";
import userModel from "../models/user-model.js";
import sendResponse from "../utils/functions/api-response.js";
import bcrypt from 'bcrypt';
import { decodeToken, exchangeJWT, signRefreshJWT, signAccessJWT, verifyAccessJWT, verifyRefreshJWT} from "../utils/functions/jwt/jwt-auth.js";

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
            message: "The Username is incorrect or doesn't exist",
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
    isAlreadyLoggedIn
}