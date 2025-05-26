import CustomError from "../errors/custom-error-class.js";
import userModel from "../models/user-model.js";
import sendResponse from "../utils/functions/api-response.js";
import bcrypt from 'bcrypt';

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

    return sendResponse(res, {
        message: 'You have logged in to your account',
        statusCode: 200
    })
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
    authenticateUser
}