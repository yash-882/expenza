import jwt  from 'jsonwebtoken'
import CustomError from '../../../errors/custom-error-class.js';
// THIS MODULE IS ONLY FOR AUTHENTICATION, IT DOESN'T THROW ERRORS
// FOR JWT EXPIRATION INSTEAD, IT REISSUES A NEW TOKEN 
// ONLY IF THE ACCESS TOKEN IS EXPIRED AND THE REFRESH TOKEN IS VALID

// verifr Access Tokens
export const verifyAccessJWT = (accessToken) => {
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECKEY_AT);
        return decoded
    }
    catch (err) {
        //expiration error 
        if (err.name == 'TokenExpiredError')
            return err;

        else
        //  JsonWebTokenError: throw custom error to trigger GlobalErrorHandler
            throw new CustomError(err, 401)
    }
}

// decoded token
export const decodeToken = (token) => jwt.decode(token);
    

// Sign Access Tokens
export const signAccessJWT = (payload) => {
    const accessToken = jwt.sign({
        ...payload, type: 'AccessToken', //identifier for access tokens
    }, process.env.JWT_SECKEY_AT, {
        expiresIn: '1h' //expires in 1 hour
    })

    return accessToken;
}