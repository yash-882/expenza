import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please set a Name'],
        trim: true,
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: [true, 'This Email is already in use, Please try a different one.'],
        validate: {
            validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: v => 'Invalid Email format!'
        }
    },
    password: {
        type: String,
        required: [true, 'Please create password'],
        minlength: [8, 'Password must contain atleast 8 characters']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please re-enter the Password']
    },
    createdAt: {
        type: Date,
        default: new Date
    }
})

userSchema.pre('save', async function (next) {

    // checks if the password is same as the previous one
    if (!this.isModified('password')) return next();

    if (this.password !== this.confirmPassword)
        return next(new Error('Please re-enter your Password correctly'))

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;

    return next();
})

const userModel = mongoose.model('users', userSchema)

export default userModel