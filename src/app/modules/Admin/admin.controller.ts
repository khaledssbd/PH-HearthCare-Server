/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { pick } from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';
import { paginationFields } from '../../../helpers/paginationHelper';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// getAllAdmin
const getAllAdmin = async (req: Request, res: Response) => {
  try {
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

    sendResponse(res, {
      statusCode: StatusCodes.OK,
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
};

// updateAdmin
const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await adminService.updateAdminIntoDB(id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Admin updated successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
};

// deleteAdmin
const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await adminService.deleteAdminFromDB(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Admin deleted successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
};

// softDeleteAdmin
const softDeleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await adminService.softDeleteAdminFromDB(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Admin deleted successfully!',
      data: result,
    });
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
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
