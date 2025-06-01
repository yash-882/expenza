import CustomError from "../errors/custom-error-class.js";
import transactionModel from "../models/transaction-model.js";
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

// add transaction
const createTransaction = wrapper(async(req, res, next) => {
    if(!req.body || Object.keys(req.body).length === 0){
        return next(new CustomError({
            name: 'BadRequestError',
            message: 'Form fields are required to fill!'
        }, 400))
    }

    const userID = req.user._id; //user's ID
    let body = req.body; //transaction

    // on multiple transaction creation
    if(Array.isArray(body)){
        // assign user ID in each document
        for(let transac of body){
            Object.assign(transac, {user: userID})
        } 
    } else{
      Object.assign(body, {user: userID}) //on single transaction creation
    }

    // creating transaction...
    const transaction = await transactionModel.create(body);
    const message = Array.isArray(transaction) ? 'Transactions has been added':
    'Transaction has been added'

    sendResponse(res, {
        statusCode: 201,
        message: message,
        data: transaction
    })
})

const getTransactionByID = wrapper(async(req, res, next) => {
    const userID = req.user._id; //user's ID
    const transactionID = req.params.id

    // updation...
    const transaction =  await transactionModel.findOne(
        {user: userID, _id: transactionID})

    // no transactions were found
    if(!transaction){
        return sendResponse(res, {
            status: 'success',
            message: "Transaction was not found"
        })
    }

    // transaction is deleted
    sendResponse(res, {
        data: transaction,
    })
})

// get transactions
const getTransactions = wrapper(async(req, res, next) => {
    const userID = req.user._id //user's ID
    const transactions =  await transactionModel.find({user: userID})

    // no transactions were found
    if(transactions.length == 0){
        return sendResponse(res, {
            status: 'success',
            message: "No transactions yet. Let's add your first one!😃"
        })
    }

    // sending data...
    sendResponse(res, {
        data: transactions,
        dataLength: transactions.length
    })
})

const updateTransactionByID = wrapper(async(req, res, next) => {
    const userID = req.user._id; //transaction's owner
    const toUpdate = req.body; //to update
    const transactionID = req.params.id

    // body is missing
    if(!toUpdate || Object.keys(toUpdate).length === 0){
        return next(new CustomError({
            name: 'BadRequestError',
            message: "Fields can't be empty",

        }, 400))
    }

    // ID isn't provided
    if(!transactionID){
        return next(new CustomError({
            name: 'BadRequestError',
            message: "Transaction ID is required for updation",

        }, 400))
    }

    // updation...
    const transaction =  await transactionModel.findOneAndUpdate(
        {user: userID, _id: transactionID},
        {"$set": {...toUpdate, updatedAt: new Date()}}, //data to update
        {new: true, runValidators: true})

    // no transactions were found
    if(!transaction){
        return sendResponse(res, {
            status: 'success',
            message: "Transaction was not found for updation"
        })
    }

    // sending data...
    sendResponse(res, {
        data: transaction,
    })
})
// delete transaction by ID
const deleteTransactionByID = wrapper(async(req, res, next) => {
    const userID = req.user._id; //user's ID
    const transactionID = req.params.id

    // ID isn't provided
    if(!transactionID){
        return next(new CustomError({
            name: 'BadRequestError',
            message: "Transaction ID is required for deletion",

        }, 400))
    }

    // updation...
    const transaction =  await transactionModel.findOneAndDelete(
        {user: userID, _id: transactionID})

    // no transactions were found
    if(!transaction){
        return sendResponse(res, {
            status: 'success',
            message: "Transaction was not found for deletion"
        })
    }

    // transaction is deleted
    sendResponse(res, {
        statusCode: 204
    })
})

// delete multiple transactions
const deleteTransactions = wrapper(async(req, res, next) => {
    const userID = req.user._id; //user's ID
    // delete all...
    const transaction =  await transactionModel.deleteMany({
        ...req.query, 
        user: userID})

    // no transactions were found
    if(!transaction){
        return sendResponse(res, {
            status: 'success',
            message: "Transactions were not found for deletion"
        })
    }

    // transaction is deleted
    sendResponse(res, {
        statusCode: 204
    })
})

export default {
    createTransaction, 
    getTransactions,
    getTransactionByID,
    updateTransactionByID,
    deleteTransactionByID,
    deleteTransactions
}