// errors by frameworks like mongoose, jwt etc don't include isOperational property
// even if they are considered as operational
// OPERATIONAL_ERRORS helps identifying those errors 

const OPERATIONAL_ERRORS= new Map([
    ['CastError', 400], //Invalid id format
    ['ValidationError', 400], // Mongoose validation error
    ['TokenExpiredError', 401], //JWT token expired error 
    [11000, 409], //MongoDB duplication error
    ['JsonWebTokenError', 401], //JWT invalid token
])

// development errors
const devResponse = (err, res) => {

    // return err response
    return res.status(err.statusCode).json({
        status: 'fail',
        name: err.name,
        message: err.message,
        stack: err.stackTrace || err.stack, //may come from native JS or manually by CustomError class
        err: err,
    })
}

//express passes the flow directly to this middleware
//whenever next() has a parameter except undefined
const GlobalErrorHandler = (err, req, res, next) => {
    console.log('Error:', err);

         // double check.. if the error is thrown by a framework then 
    // we look up in StatusCode map ,if not found then its a SERVER ERROR
    let statusCode = err.statusCode || OPERATIONAL_ERRORS.get(err.name) || 500;
    const name = err.name || 'InternalServerError';
    const message = err.message || 'Something went wrong! please try again later'

    // mark it as operational if not a server error
    const isOperational = err.statusCode !== 500

    // check for mongoDB duplication error
    if(err.code == 11000 && err.name == 'MongoServerError'){
        statusCode = OPERATIONAL_ERRORS.get(err.code)
    }

    const error = { 
        ...err, 
        statusCode, 
        name, 
        message,
        isOperational,
        stackTrace: err.stackTrace || err.stack, //may come from native JS or manually by CustomError class
    }

    // development mode
    if (process.env.NODE_ENV == 'development')
        return devResponse(error, res)
    
    // production mode
    else if (process.env.NODE_ENV == 'production') {
        return res.status(statusCode).json({
            status: 'fail',
            message
        })
    }
}

export default GlobalErrorHandler