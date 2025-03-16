import AppError from '../utils/appError.js';
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const match = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/);
    const value = match ? match[0] : '';
    const message = `Duplicate field value ${value}. Please use another value instead`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors)?.map((el) => el.message);
    const message = `Invalid input data ${errors.join('. ')} `;
    return new AppError(message, 400);
};
const handleJWTError = () => new AppError('Invalid token. Please login again', 401);
const handleJWTExpiredError = () => new AppError('Your token is expired. Please login again', 401);
const sendErrorDev = (err, req, res) => {
    console.log('💥ERROR from errorController', err);
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, req, res) => {
    console.log('💥ERROR from errorController', err);
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else {
        if (err.name === 'CastError') {
            err = handleCastErrorDB(err);
        }
        if (err.code === 11000) {
            err = handleDuplicateFieldsDB(err);
        }
        if (err.name === 'ValidationError') {
            err = handleValidationErrorDB(err);
        }
        if (err.name === 'JsonWebTokenError') {
            err = handleJWTError();
        }
        if (err.name === 'TokenExpiredError') {
            err = handleJWTExpiredError();
        }
        sendErrorProd(err, req, res);
    }
};
