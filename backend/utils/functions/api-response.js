// structure of api good responses
const sendResponse = (res, {
    statusCode=200, 
    message,
    data, 
    dataLength
}) => {
    res.status(statusCode).json({
        status:'success',
        requestedAt: new Date().toISOString(),
        message, 
        dataLength,
        data,
    })
}

export default sendResponse;