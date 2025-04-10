// PH CODE
// import { Prisma } from "@prisma/client";
// import { NextFunction, Request, Response } from "express"
// import { StatusCodes } from "http-status-codes";
// import config from "../config";

// const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

//     let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
//     let success = false;
//     let message = err?.message || "Something went wrong!";
//     let error = err;

//     if (err instanceof Prisma.PrismaClientValidationError) {
//         message = 'Validation Error';
//         error = err?.message
//     }
//     else if (err instanceof Prisma.PrismaClientKnownRequestError) {
//         if (err?.code === 'P2002') {
//             message = "Duplicate Key error";
//             error = err?.meta;
//         }
//     }

//     res.status(statusCode).json({
//         success,
//         message,
//         error
//     })
// };

// export default globalErrorHandler;

// GROK CODE
// import { Prisma } from '@prisma/client';
// import { Request, Response, NextFunction } from 'express';
// import config from "../config";

// interface ErrorResponse {
//   success: boolean;
//   message: string;
//   error?: any;
//   code?: string;
//   meta?: any;
// }

// export const globalErrorHandler = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   let statusCode: number = err?.statusCode || 500;
//   let message: string = err?.message || 'Internal Server Error';
//   const response: ErrorResponse = {
//     success: false,
//     message,
//   };

//   // Handle Prisma Client Known Request Errors
//   if (err instanceof Prisma.PrismaClientKnownRequestError) {
//     response.code = err?.code;
//     response.meta = err?.meta;

//     switch (err?.code) {
//       case 'P2000':
//         message = `Value too long for column: ${err?.meta?.target}`;
//         statusCode = 400;
//         break;
//       case 'P2002':
//         message = `Unique constraint failed on: ${(
//           err?.meta?.target as string[]
//         ).join(', ')}`;
//         statusCode = 409; // Changed to 409 Conflict
//         break;
//       case 'P2003':
//         message = `Foreign key constraint failed on: ${err?.meta?.field_name}`;
//         statusCode = 400;
//         break;
//       case 'P2011':
//         message = `Null constraint violation on: ${err?.meta?.target}`;
//         statusCode = 400;
//         break;
//       case 'P2025':
//         message = (err?.meta?.cause as string) || 'Required record not found';
//         statusCode = 404;
//         break;
//       case 'P2030':
//         message = 'Fulltext index not found';
//         statusCode = 400;
//         break;
//       default:
//         message = err?.message || 'Database operation failed';
//     }
//   }

//   // Handle Prisma Validation Errors
//   if (err instanceof Prisma.PrismaClientValidationError) {
//     message = err?.message
//       .split('\n')
//       .filter((line: string) => line.trim().length > 0)
//       .join(' ')
//       .trim();
//     statusCode = 400;
//   }

//   // Handle Prisma Initialization Errors
//   if (err instanceof Prisma.PrismaClientInitializationError) {
//     message = `Database connection failed: ${err?.message}`;
//     statusCode = 503; // Service Unavailable
//     response.error = {
//       errorCode: err?.errorCode,
//       clientVersion: err?.clientVersion,
//     };
//   }

//   // Handle Prisma Rust Panic Errors
//   if (err instanceof Prisma.PrismaClientRustPanicError) {
//     message = 'Critical database engine error occurred';
//     statusCode = 500;
//   }

//   // Handle Prisma Client Unknown Errors (new in recent versions)
//   if (err instanceof Prisma.PrismaClientUnknownRequestError) {
//     message = `Unknown database error: ${err?.message}`;
//     statusCode = 500;
//   }

//   // Update response with final message
//   response.message = message;

//   // Include detailed error info only in development
//   if (config.env === 'development') {
//     response.error = {
//       stack: err?.stack,
//       details: err,
//     };
//   }

//   res.status(statusCode).json(response);
// };

// // Optional: Type guard helper functions
// export const isPrismaError = (
//   err: any
// ): err is Prisma.PrismaClientKnownRequestError => {
//   return err instanceof Prisma.PrismaClientKnownRequestError;
// };

// GROK CODE Fixed by CHATGPT & me
import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
// import { TErrorSources } from '../interface/error';
import { ZodError } from 'zod';
import AppError from '../errors/AppError';
import handleZodError from '../errors/handleZodError';
import { TGlobalError } from '../interfaces/error';

interface ErrorResponse {
  success: boolean;
  message: string;
  errorSources?: { path: string; message: string }[] | Record<string, unknown>;
  // code?: string;
  // meta?: any;
}

// Utility function to handle Prisma known errors
const handlePrismaKnownError = (
  err: Prisma.PrismaClientKnownRequestError
): { statusCode: number; message: string } => {
  switch (err?.code) {
    case 'P2000':
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Value too long for column: ${err?.meta?.target}`,
      };
    case 'P2002':
      return {
        statusCode: StatusCodes.CONFLICT, // 409 Conflict
        message: `Unique constraint failed on: ${(
          err?.meta?.target as string[]
        ).join(', ')}`,
      };
    case 'P2003':
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Foreign key constraint failed on: ${err?.meta?.field_name}`,
      };
    case 'P2011':
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Null constraint violation on: ${err?.meta?.target}`,
      };
    case 'P2025':
      return {
        statusCode: StatusCodes.NOT_FOUND,
        message: (err?.meta?.cause as string) || 'Required record not found',
      };
    case 'P2030':
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Fulltext index not found',
      };
    default:
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: err?.message || 'Database operation failed',
      };
  }
};

// globalErrorHandler function
export const globalErrorHandler = (
  err: TGlobalError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
  let message: string = err?.message || 'Internal Server Error';
  let errorSources:
    | { path?: string; message?: string }[]
    | Record<string, unknown>
    | undefined;
  // let code: string;
  // let meta: any;

  const response: ErrorResponse = {
    success: false,
    message,
  };

  // Handle Prisma Client Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // code = err?.code;
    // meta = err?.meta;

    const prismaError = handlePrismaKnownError(err);
    statusCode = prismaError.statusCode;
    message = prismaError.message;
  }

  // Handle Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = err?.message
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .join(' ')
      .trim();
  }

  // Handle Prisma Initialization Errors
  if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    message = `Database connection failed: ${err?.message}`;
    errorSources = {
      errorCode: err?.errorCode,
      clientVersion: err?.clientVersion,
      connectionString: config.database_url, // Optional (for debugging purposes)
    };
  }

  // Handle Prisma Rust Panic Errors
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = 'Critical database engine error occurred';
  }

  // Handle Prisma Client Unknown Errors (new in recent versions)
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = `Unknown database error: ${err?.message}`;
  }

  // Handle Zod-validation error
  if (err instanceof ZodError) {
    const simplifiedZodError = handleZodError(err);
    statusCode = simplifiedZodError?.statusCode;
    message = simplifiedZodError?.message;
    errorSources = simplifiedZodError?.errorSources;
  }

  // Handle AppError & Generic Error type error
  if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  // Update response with final message
  response.message = message;

  // Fallback for unexpected errors
  if (!response?.message) {
    response.message = 'An unexpected error occurred';
  }

  errorSources = {
    ...errorSources,
    stack: err?.stack,
    details: err,
  };

  // Development environment based detailed errors(turnery operator based short approach)
  response.errorSources =
    config.env === 'development' ? errorSources : undefined;
  // response.code = config.env === 'development' ? code : undefined;
  // response.meta = config.env === 'development' ? meta : undefined;

  // // Development environment based detailed errors(if condition based long approach)
  // if (config.env === 'development') {
  //   response.errorSources = {
  //     ...response.errorSources,
  //     stack: err?.stack,
  //     details: err,
  //   };
  // } else {
  //   // Designed for production environment
  //   response.errorSources = undefined;
  //   response.code = undefined;
  //   response.meta = undefined;
  // }

  res.status(statusCode).json(response);
};

// Optional: Type guard helper function
export const isPrismaError = (
  err: TGlobalError
): err is Prisma.PrismaClientKnownRequestError => {
  return err instanceof Prisma.PrismaClientKnownRequestError;
};
