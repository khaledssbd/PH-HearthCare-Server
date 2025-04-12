import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import tryCatchAsync from '../utils/tryCatchAsync';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { UserRole } from '@prisma/client';
import {
  findUserByEmail,
  isTokenIssuedBeforePasswordChange,
} from '../../helpers/authHelpers';

const auth = (...requiredRoles: UserRole[]) => {
  return tryCatchAsync(
    async (
      req: Request & { user?: JwtPayload },
      res: Response,
      next: NextFunction
    ) => {
      const token = req.headers.authorization;
      // checking if the token is missing
      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
      }

      // checking if the given token is expired or valid
      const decoded = jwtHelpers.verifyToken(
        token,
        config.jwt.access_secret as string
      );

      const { role, email, iat } = decoded;

      // checking if the user is exist
      const user = await findUserByEmail(email);
      if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
      }

      // checking if the user is already deleted
      const userStatus = user?.status;

      if (userStatus === 'DELETED') {
        throw new AppError(StatusCodes.FORBIDDEN, 'Your account is deleted!');
      }

      // checking if the user is blocked
      if (userStatus === 'BLOCKED') {
        throw new AppError(StatusCodes.FORBIDDEN, 'Your account is blocked!');
      }

      // checking if any hacker using a token even-after the user changed the password
      if (
        user.passwordChangedAt &&
        (await isTokenIssuedBeforePasswordChange(
          user.passwordChangedAt,
          iat as number
        ))
      ) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
      }

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          'You are not authorized yet!'
        );
      }

      req.user = decoded;
      next();
    }
  );
};

export default auth;
