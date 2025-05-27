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
const devErrors = (err, res) => {
     // double check.. if the error is thrown by a framework then 
    // we look up in StatusCode map ,if not found then its a SERVER ERROR
    let statusCode = err.statusCode || OPERATIONAL_ERRORS.get(err.name) || 500;
    const errName = err.name || 'InternalServerError';

    // mark it as operational if not a server error
    if(statusCode != 500){
        err.isOperational = true;
    }

    // check for mongoDB duplication error
    if(err.code == 11000 && err.name == 'MongoServerError'){
        statusCode = OPERATIONAL_ERRORS.get(err.code)
    }

    // return err response
    return res.status(statusCode).json({
        status: 'fail',
        name: errName,
        message: err.message,
        stack: err.stackTrace || err.stack, //may come from native JS or manually by CustomError class
        err: err,
    })
}

//express passes the flow directly to this middleware
//whenever next() has a parameter except undefined
const GlobalErrorHandler = (err, req, res, next) => {
    console.log('Error:', err);

    // development mode
    if (process.env.NODE_ENV == 'development')
        return devErrors(err, res)
    
    // production mode
    else if (process.env.NODE_ENV == 'production') {
        // error details
        const message = err.message || "Something went wrong! please try again later."
        const statusCode = err.statusCode || 500

        return res.status(statusCode || 500).json({
            status: 'fail',
            message
        })
    }
    //simply return the response in production
    res.status(err.statusCode || 500).json({ status: 'fail', message })
}

export default GlobalErrorHandler