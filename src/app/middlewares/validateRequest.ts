import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import tryCatchAsync from '../utils/tryCatchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return tryCatchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      // validation (if everything is alright next() will be called)
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        // headers: req.headers, // only for getting accessToken by refreshToken
        // params: req.params,  // no need to use as params works as URL
        // cookies: req.cookies,
      });
      next();
    },
  );
};

export default validateRequest;
