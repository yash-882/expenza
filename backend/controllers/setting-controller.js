import CustomError from "../errors/custom-error-class.js";
import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import sendResponse from "../utils/functions/api-response.js";
import transactionModel from "../models/transaction-model.js";
import nodemailer from "../utils/functions/nodemailer/nodemailer.js";
import OTPModel from "../models/otp-model.js";

function wrapper(controller) {
    return async (req, res, next) => {
        try {
            // results
            await controller(req, res, next)
        }
        catch (err) {
            next(err)
        }
    }
}
const changePassword = wrapper(async (req, res, next) => {
    const user = req.user;
    const body = req.body;

    // body includes all required fields?
    if (!body || Object.keys(body).length === 0 || !body.currentPassword || !body.newPassword || !body.confirmPassword) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Please enter all required fields'
        }, 400))
    }

    //  if confirmed password is not correct
    if (body.newPassword !== body.confirmPassword) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Confirm your password correctly'
        }, 400))
    }

    const hashedPassword = user.password; //hashed password in DB
    const currentPassword = body.currentPassword; //current password entered by user

    //  are both same?
    const isCorrect = await bcrypt.compare(currentPassword, hashedPassword)

    if (!isCorrect) {
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
    const updationResult = await userModel.findByIdAndUpdate(user._id, { "$set": { password: newHashedPassword } })


    if (!updationResult) {
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
    res.clearCookie('AT', { httpOnly: true })
    res.clearCookie('RT', { httpOnly: true })

    sendResponse(res, {
        message: 'Logged out successfully'
    })
})

const accountDetails = wrapper(async (req, res, next) => {
    const userID = req.user._id; //user ID

    // find user details...
    const userDetails = await userModel.findById(userID);

    // if user not found
    if (!userDetails) {
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
    if (!deletedUser) {
        return next(new CustomError({
            name: 'NotFoundError',
            message: 'User not found'
        }))
    }

    // delete all transactions added by user
    await transactionModel.deleteMany({ user: userID })

    // clear all tokens
    res.clearCookie('AT', { httpOnly: true })
    res.clearCookie('RT', { httpOnly: true })

    // user is deleted
    sendResponse(res, {
        statusCode: 204
    })
})

// verify email and send 
const verifyNewEmail = wrapper(async (req, res, next) => {
    const body = req.body; //new email to modify
    const user = req.user; //user

    // if body doesn't contain new email
    if (!body || !body.newEmail || body.newEmail === req.user.email) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Please enter a new email'
        }, 400))
    }
    
    //  check email format
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.newEmail)
    
    //  if invalid
    if (!isValid) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Invalid Email format!'
        }, 400))
    }
    
    //generate 6 digits OTP
    const OTP = Math.floor(Math.random() * 900000) + 100000;
    // hashing OTP...
    const hashedOTP = await bcrypt.hash(String(OTP), 10)
    
    // if OTP is resended
    const isAlreadyRequested = req.OTPDetails;

    if (isAlreadyRequested) {
        // updating OTP...
        await OTPModel.updateOne({ email: user.email }, 
            {"$set":{otp: hashedOTP},
        "$inc": {requestCount: 1}})
    }
    else {
        // store OTP in DB...
        await OTPModel.create({
            otp: hashedOTP,
            email: user.email,
            newEmail: body.newEmail
        })
    }
    // sending OTP...
    await nodemailer.sendMail({
        from: `Expenza <${process.env.GMAIL}>`,
        to: body.newEmail,
        subject: 'Change Email',
        html: `<p style='font-size:16px;'>
        Use this OTP to change Email
        <b style='font-size:20px;'>
        ${OTP}
        </b></p>`
    })

    // OTP sent
    sendResponse(res, {
        statusCode: 201,
        message: 'OTP sent to your new Email'
    })
})

// validate and update email
const changeEmail = wrapper(async (req, res, next) => {
    const body = req.body; //contains OTP
    const user = req.user; //user
    
    if (!body || !body.otp) {
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Please enter OTP that was sent to your Email'
        }, 400))
    }
    
    // entered OTP
    const enteredOTP = body.otp;

    // check for OTP expiration
    const OTPInDB = await OTPModel.findOne({ email: user.email })

    if(!OTPInDB){
        return next(new CustomError({
            name: 'UnauthorizedError',
            message: 'OTP is expired. You can request a new one.'
        }, 401))
    }

    const isCorrect = await bcrypt.compare(enteredOTP, OTPInDB.otp);
    
    // if OTP is incorrect
    if (!isCorrect) {
        // updating OTP attempts for invalid OTPs 
        await OTPModel.updateOne({email: user.email}, {"$inc": {attemptCount: 1}})

        // Incorrect OTP
        return next(new CustomError({
            name: 'UnauthorizedError',
            message: 'Incorrect OTP!'
    }))
    }

    // For valid OTP
    // updating email...
    await userModel.findByIdAndUpdate(user._id, { email: OTPInDB.newEmail }, { runValidators: true })
    // deleting OTP 
    await OTPInDB.deleteOne(user.newEmail);

    // updated
    sendResponse(res, {
        message: 'Email updated succesfully'
    })
})


export default {
    changePassword,
    logout,
    accountDetails,
    deleteAccount,
    verifyNewEmail,
    changeEmail
}