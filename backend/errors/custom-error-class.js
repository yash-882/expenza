class CustomError extends Error{

    constructor(err, statusCode){
            super(err.message)
            this.err = err;
            this.statusCode=statusCode
            this.name = err.name;
            this.message = err.message 
            this.stackTrace = this.stack;
            this.isOperational = true;
    }
}

export default CustomError