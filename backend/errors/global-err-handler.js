// errors created using the CustomError class manually that will always contain
// isOperational property for errs like , 404(not found), 401(unauthorized)
// but if the error is thrown by libraries like mongoDB, jwt,etc, 
// they throw the error directly to the Global ERROR handler and
// do not contain the isOperational property even though they are considered as 
// operational errors
// for those errors, we manually define HTTP status codes

const StatusCodes = new Map([
    ['CastError', 400], //Invalid id format
    ['ValidationError', 400], // Mongoose validation error
    ['TokenExpiredError', 401], //JWT token expired error 
    [11000, 409], //MongoDB duplication error
    ['JsonWebTokenError', 401], //JWT invalid token
])

// development errors
const devErrors = (err, res) => {
    // handles both operational and non-operational errors using StatusCodes map

     // double check.. if the error is thrown by a framework then 
    // we look up in StatusCode map ,if not found then its a SERVER ERROR
    const statusCode = err.statusCode || StatusCodes.get(err.name) || 500;
    const errName = err.name || 'InternalServerError';

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
        o
        return res.status(statusCode || 500).json({
            status: 'fail',
            message
        })
    }
    //simply return the response in production
    res.status(err.statusCode || 500).json({ status: 'fail', message })
}

export default GlobalErrorHandler