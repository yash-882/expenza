import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: v => 'Invalid Email format!'
        }
    },
    password: {
        type: String,
        required: [true, 'Create a password'],
        minlength: [8, 'Password must contain atleast 8 characters']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm the Password']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },

    budget: {
        createdAt: {
            type: Date,
            default: null
        },
        monthlyBudget: {
            type: Number,
            default:0
        }
    }
})

userSchema.pre('save', async function (next) {

    if (this.password !== this.confirmPassword)
        return next(new Error('Please re-enter your Password correctly'))

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;

    // mongoDB will automatically executes this date func and converts to ISOSrting
    this.lastUpdated = Date.now

    return next();
})

const userModel = mongoose.model('users', userSchema)

export default userModel

const budget = {
    createdAt: null,
    monthlyBudget: 3878

}