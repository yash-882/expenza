import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    type: {
        type: String,
        enum : ['expense', 'income'],
        required: [true, 'Transaction type is mandatory to fill'],
        lowercase: true
    },
    category:{
        type: String,
        required: [true, 'Transaction Category is mandatory to fill'],
        lowercase: true,
        enum: {
    values:  ['food','transport','housing','entertainment','healthcare',
              'education', 'job', 'freelance', 'bonus', 'other expense', 'other income', ],
        
    message: 'Invalid Category: {VALUE}' //VALUE converts to the current value on validation error
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    amount:{
        type: Number,
        required: [true, 'Transaction Amount is mandatory to fill'],
        validate: {
            validator: amount => amount >= 0,
            message: 'Amount should not be negative'
        }
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
    // mongoDB will automatically execute this date func and converts to ISOString
    this.lastUpdated = Date.now
    
    // contains categories but with emoji
    const categories = ['🍽️ food','🚌 transport','🏠 housing','🎮 entertainment','💊 healthcare',
        '🎓 education','📦 others', '💼 job', '💻 freelance', '💰 bonus'];
        
        
        // Appending emoji from begining of a category
        const category = categories.find(categ => categ.split(' ')[1] === this.category);
        
        // if the category isn't listed in array (definitely contains one of these 'other expense', 'other income')
        this.category = !category ? this.category : category
        
        next();    
    })

    const transactionModel = mongoose.model('transactions', transactionSchema)
    export default transactionModel;