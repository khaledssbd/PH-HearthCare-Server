import { Request, Response } from 'express';
import { userService } from './user.service';

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdmin(req.body);
    res.status(200).json({
      success: true,
      message: 'Admin created successfully!',
      data: result,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || 'Something went wrong!',
      error: err,
    });
  }
};

export const userController = {
  createAdmin,
};
