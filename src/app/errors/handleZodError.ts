import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

// zod-validation error handler
const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;

  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1].toString(),
      message: issue.message,
    };
  });

  return {
    statusCode,
    message: 'Validation Error!',
    errorSources,
  };
};

export default handleZodError;
