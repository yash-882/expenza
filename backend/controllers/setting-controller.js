import CustomError from "../errors/custom-error-class.js";
import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import sendResponse from "../utils/functions/api-response.js";
import transactionModel from "../models/transaction-model.js";

function wrapper(controller){
    return async (req, res, next) => {
        try{
            // results
            await controller(req, res, next)
        }
        catch(err){
            next(err)
        }
    } 
}
const changePassword = wrapper(async (req, res, next) => {
     const user = req.user; 
     const body = req.body;

    // body includes all required fields?
     if(!body || Object.keys(body).length === 0 || !body.currentPassword || !body.newPassword || !body.confirmPassword){
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Please enter all required fields'
        }, 400))
     }

    //  if confirmed password is not correct
     if(body.newPassword !== body.confirmPassword){
          return next(new CustomError({
            name: 'BadRequestError',
            message: 'Confirm your password correctly'
        }, 400))
     }

     const hashedPassword = user.password; //hashed password in DB
     const currentPassword = body.currentPassword; //current password entered by user
     
    //  are both same?
     const isCorrect = await bcrypt.compare(currentPassword, hashedPassword)

     if(!isCorrect){
         return next(new CustomError({
            name: 'UnauthorizedError',
            message: 'Current password is incorrect!'
        }, 401))
     }

      //checks if the new entered Password is not different from the Password stored in DB
         const isPasswordSame = await bcrypt.compare(body.newPassword, user.password)
     
         if (isPasswordSame) {
             return next(new CustomError({
                 message: 'New Password must be different from the previous one'
             }))
         }
     

    //  hashing password...
     const newHashedPassword = await bcrypt.hash(body.newPassword, 12);

    // updating password...
    const updationResult = await userModel.findByIdAndUpdate(user._id, {"$set": {password: newHashedPassword}})


    if(!updationResult){
         return next(new CustomError({
            name: 'NotFoundError',
            message: 'User not found'
        }, 404))
    }

    // updation is completed
    sendResponse(res, {
        message: 'Password updated sucessfully'
    })
})

// log out user
const logout = wrapper(async (req, res, next) => {
    // clear all tokens
    res.clearCookie('AT', {httpOnly: true})
    res.clearCookie('RT', {httpOnly: true})

    sendResponse(res, {
        message: 'Logged out successfully'
    })
})

const accountDetails = wrapper(async (req, res, next) => {
    const userID = req.user._id; //user ID

    // find user details...
    const userDetails = await userModel.findById(userID);

    // if user not found
    if(!userDetails){
        return next(new CustomError({
            name: 'NotFoundError',
            message: 'User not found'
        }))
    }

    // account details
    sendResponse(res, {
        data: userDetails
    })
})

const deleteAccount = wrapper(async (req, res, next) => {
const userID = req.user._id; //user ID

// find user for deletion
    const deletedUser = await userModel.findByIdAndDelete(userID);
    
    // if user not found
    if(!deletedUser){
        return next(new CustomError({
            name: 'NotFoundError',
            message: 'User not found'
        }))
    }
    
    // delete all transactions added by user
    await transactionModel.deleteMany({user: userID})

    // clear all tokens
    res.clearCookie('AT', {httpOnly: true})
    res.clearCookie('RT', {httpOnly: true})

    // user is deleted
    sendResponse(res, {
        statusCode: 204
    })
})

export default {
    changePassword,
    logout,
    accountDetails,
    deleteAccount
}