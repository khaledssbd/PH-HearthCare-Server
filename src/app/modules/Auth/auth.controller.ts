import { Request, Response } from 'express';
import tryCatchAsync from '../../utils/tryCatchAsync';
import { AuthServices } from './auth.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

import { JwtPayload } from 'jsonwebtoken';

// loginUser
const loginUser = tryCatchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUserIntoDB(req.body);
  const { accessToken, refreshToken, needPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Logged in successfully!',
    data: {
      accessToken: accessToken,
      needPasswordChange: needPasswordChange,
    },
  });
});

// refreshToken
const refreshToken = tryCatchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access token genereated successfully!',
    data: result,
    // data: {
    //     accessToken: result.accessToken,
    //     needPasswordChange: result.needPasswordChange
    // }
  });
});

// changePassword
const changePassword = tryCatchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const user = req.user;

    const result = await AuthServices.changePassword(user!, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Password Changed successfully!',
      data: result,
    });
  }
);

// forgotPassword
const forgotPassword = tryCatchAsync(async (req: Request, res: Response) => {
  await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Check your email!',
    data: null,
  });
});

// resetPassword
const resetPassword = tryCatchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';

  await AuthServices.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password Reset!',
    data: null,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
