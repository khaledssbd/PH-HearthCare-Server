import { Request, Response } from 'express';
import { adminService } from './admin.service';

const getAllAdmin = async (req: Request, res: Response) => {
  const result = adminService.getAllAdmin();

  res.status(200).json({
    success: true,
    message: 'Admins fetched successfully!',
    data: result,
  });
};

export const adminController = {
  getAllAdmin,
};
