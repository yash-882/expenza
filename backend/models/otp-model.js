import mongoose from "mongoose";

const OTPSchema = mongoose.Schema({
    otp: {
        type: String,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    newEmail: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    requestCount:{
        type:Number,
        default:1,
        min:0
    },
    attemptCount:{
        type:Number,
        default:0,
        min:0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, //OTP expires in 5 minutes 
    }
})

const OTPModel = mongoose.model('otp', OTPSchema)

export default OTPModel;