/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { pick } from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';
import { paginationFields } from '../../../helpers/paginationHelper';

// getAllAdmin
const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const result = await adminService.getAllAdminFromDB(
      filters,
      paginationOptions
    );

    res.status(200).json({
      success: true,
      message: 'Admins fetched successfully!',
      data: result.data,
      meta: result.meta,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
};

// getAdminById
const getAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await adminService.getAdminByIdFromDB(id);

    res.status(200).json({
      success: true,
      message: 'Admin fetched successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   message: 'Admin data fetched by id!',
  //   data: result,
  // });
};

export const adminController = {
  getAllAdmin,
  getAdminById,
};
