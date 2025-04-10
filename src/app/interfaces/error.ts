import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import AppError from '../errors/AppError';

export type TErrorSources = {
  path: string;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};

export type TGlobalError =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientValidationError
  | Prisma.PrismaClientInitializationError
  | Prisma.PrismaClientRustPanicError
  | Prisma.PrismaClientUnknownRequestError
  | ZodError
  | AppError
  | Error;
