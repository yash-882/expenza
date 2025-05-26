import CustomError from "../errors/custom-error-class.js";
import userModel from "../models/user-model.js";
import sendResponse from "../utils/functions/api-response.js";

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
}