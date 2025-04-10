import { Admin, Prisma, UserStatus } from '.prisma/client';
import { adminSearchableFields } from './admin.constant';
import { calculatePagination } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';
import { IAdminFilterRequest } from './admin.interface';
import { TPaginationOptions } from '../../interfaces/pagination';

// getAllAdminFromDB
const getAllAdminFromDB = async (
  params: IAdminFilterRequest,
  pagiOptions: TPaginationOptions
) => {
  const { searchTerm, ...filterData } = params;
  const { limit, page, sortBy, sortOrder } = calculatePagination(pagiOptions);
  const andCondition: Prisma.AdminWhereInput[] = [];

  // handle all searchTerm here by OR
  if (searchTerm) {
    andCondition.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
        // isDeleted: false, // now showing all
      })),
    });
  }

  // handle all filterdata here by AND
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: filterData[key as keyof typeof filterData] },
        // isDeleted: false, // now showing all
      })),
    });
  }

  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip: (page - 1) * Number(limit),
    take: Number(limit),
    orderBy: { [sortBy]: sortOrder },
    // orderBy:
    //   sortBy && sortOrder ? { [sortBy as string]: sortOrder }
    //     : { createdAt: 'desc' },
  });

  const total = await prisma.admin.count({
    where: whereCondition,
  });

  // const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      // totalPage,
    },
    data: result,
  };
};

// getAdminByIdFromDB
const getAdminByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

// updateAdminIntoDB
const updateAdminIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  if ('email' in data) {
    throw new Error('Email cannot be updated!');
  }

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// deleteAdminFromDB
const deleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });

  return result;
};

// softDeleteAdminFromDB
const softDeleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });

  return result;
};

export const adminService = {
  getAllAdminFromDB,
  getAdminByIdFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
};
