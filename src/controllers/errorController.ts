/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import { CastError, Error as MongooseError } from 'mongoose';
import AppError from '../utils/appError.js';

interface IError {
  code: number;
  name: string;
}

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError) => {
  const match = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/);
  const value = match ? match[0] : '';
  const message = `Duplicate field value ${value}. Please use another value instead`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: MongooseError.ValidationError) => {
  const errors = Object.values(err.errors)?.map((el) => el.message);
  const message = `Invalid input data ${errors.join('. ')} `;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token is expired. Please login again', 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  console.log('💥ERROR from errorController', err);
  // if (req.originalUrl.startsWith('/api')) {
  //   // A) API
  //   return res.status(err.statusCode).json({
  //     status: err.status,
  //     error: err,
  //     message: err.message,
  //     stack: err.stack,
  //   });
  // }
  // // B) RENDERED WEBSITE
  // return res.status(err.statusCode).render('error', {
  //   title: 'Terjadi kesalahan!',
  //   msg: err.message,
  // });

  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  console.log('💥ERROR from errorController', err);
  // A) API
  //Operational, trusted error: send message to client
  // if (err.isOperational) {
  //   //err disini akan berasal dari appError.js, pahami alur nya
  //   return res.status(err.statusCode).json({
  //     status: err.status,
  //     message: err.message,
  //   });
  // }

  // // 2) Send generic message
  // return res.status(500).json({
  //   status: 'error',
  //   message: 'Something went very wrong',
  // });

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

//disini harus ada 4 parameter biar bisa dideteksi
export default (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  //  ketika ada middleware dg 4 parameter ini maka akan dideteksi sebagai global error handler
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    if ((err as any as IError).name === 'CastError') {
      err = handleCastErrorDB(err as any as CastError);
    }

    if ((err as any as IError).code === 11000) {
      err = handleDuplicateFieldsDB(err as any as MongoError);
    }
    if ((err as any as IError).name === 'ValidationError') {
      err = handleValidationErrorDB(
        err as any as MongooseError.ValidationError
      );
    }
    if ((err as any as IError).name === 'JsonWebTokenError') {
      err = handleJWTError();
    }
    if ((err as any as IError).name === 'TokenExpiredError') {
      err = handleJWTExpiredError();
    }

    sendErrorProd(err, req, res);
  }
};
