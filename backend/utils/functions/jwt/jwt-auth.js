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

// verify Refresh Token
export const verifyRefreshJWT = (refreshToken) => {
    // DECODE TOKENS
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECKEY_RT);
    return decoded;
}

// reissue Access Token 
export const exchangeJWT = (accessToken, refreshToken) => {
    // verify access token first
    //if err occurs, throws all errors except TokenExpiredError
    verifyAccessJWT(accessToken);

    // verify refresh token
    // will throw all JWT errors, if occurs
    const decoded = verifyRefreshJWT(refreshToken);

    // assign only ID in refresh token because
    // if the info(email, username) is changed we have to query DB on every request for newer info 
    // which may result in performance degradation


    // ACCESS TOKEN WAS EXPIRED,  REISSUANCE...
    // payload
    const payload = { id: decoded.id }

    // reissue access tokens
    return signAccessJWT(payload);

}

// Sign Refresh Tokens
export const signRefreshJWT = (payload) => {
    const refreshToken = jwt.sign({
        ...payload,
        type: 'RefreshToken', //identifier for refresh tokens
    }, process.env.JWT_SECKEY_RT, {
        expiresIn: '30d' //expires in 30 days
    })

    return refreshToken;
}

// Sign Access Tokens
export const signAccessJWT = (payload) => {
    const accessToken = jwt.sign({
        ...payload, type: 'AccessToken', //identifier for access tokens
    }, process.env.JWT_SECKEY_AT, {
        expiresIn: '20m' //expires in 20 minutes
    })

    return accessToken;
}