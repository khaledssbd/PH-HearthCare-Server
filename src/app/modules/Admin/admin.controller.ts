import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { pick } from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';
import { paginationFields } from '../../../helpers/paginationHelper';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import tryCatchAsync from '../../utils/tryCatchAsync';

// getAllAdmin
const getAllAdmin = tryCatchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await adminService.getAllAdminFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admins fetched successfully!',
    data: result.data,
    meta: result.meta,
  });
});

// getAdminById
const getAdminById = tryCatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.getAdminByIdFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin fetched successfully!',
    data: result,
  });
});

// updateAdmin
const updateAdmin = tryCatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.updateAdminIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin updated successfully!',
    data: result,
  });
});

// deleteAdmin
const deleteAdmin = tryCatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.deleteAdminFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin deleted successfully!',
    data: result,
  });
});

// softDeleteAdmin
const softDeleteAdmin = tryCatchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.softDeleteAdminFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin deleted successfully!',
    data: result,
  });
});

export const adminController = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
