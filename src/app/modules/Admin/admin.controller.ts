import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { pick } from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const paginationOptions = pick(req.query, [
      'limit',
      'page',
      'sortBy',
      'sortOrder',
    ]);
    const result = adminService.getAllAdminFromDB(filters, paginationOptions);

    res.status(200).json({
      success: true,
      message: 'Admins fetched successfully!',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
};

export const adminController = {
  getAllAdmin,
};
