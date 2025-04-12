import { Request, Response } from 'express';
import { userService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import tryCatchAsync from '../../utils/tryCatchAsync';

const createAdmin = tryCatchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin created successfully!',
    data: result,
  });
});

export const userController = {
  createAdmin,
};
