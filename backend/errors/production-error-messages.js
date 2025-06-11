export const prodErrMessages = {
    // monmgoose cast error
    CastError:  err =>  `Invalid ${err.path || 'field'}`,

    // mongoose validation error
    ValidationError:  err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid: ${errors.join(', ')}`;
    return message;
    },

    // Unauthorized error
    UnauthorizedError: err => err.message || "You aren't authorized, please login",

    // JWT error
    JsonWebTokenError: err => 'Invalid token!',
    
    // mongoose duplication error
    11000: err => {
        const duplicateField = Object.keys(err.keyValue).join(', ')
        // convert the field case to TitleCase
        const fieldName = duplicateField[0].toUpperCase() + 
        duplicateField.slice(1, duplicateField.length)

        return `${fieldName} is already in use`
    },

    // bad request error
    BadRequestError: err => err.message || 'Missing fields, invalid types',

    // too many requests sent
    TooManyRequests: err => err.message || 'Too many requests, please try again later',

    // JWT expired error
    TokenExpiredError: err => 'Session has been expired. Please login again',

    // Not found error
    NotFoundError: err => err.message || 'Content not found'
}