import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    type: {
        type: String,
        enum : ['expense', 'salary'],
        required: [true, 'Transaction type is mandatory to fill']
    },
    category:{
        type: String,
        required: [true, 'Transaction Category is mandatory to fill'],
        enum: {
    values: ['food', 'transport', 'housing', 'entertainment', 'healthcare', 'education', 'others'],
    message: 'Invalid Category: {VALUE}' //VALUE converts to the current value on validation error
        }
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    amount:{
        type: Number,
        required: [true, 'Transaction Amount is mandatory to fill']
    },
    description: String,
    lastUpdated: Date,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
})

transactionSchema.pre('save', function (next){
    // mongoDB will automatically executes this date func and converts to ISOSrting
    this.lastUpdated = new Date()
    next();

})

const transactionModel = mongoose.model('transactions', transactionSchema)

export default transactionModel;