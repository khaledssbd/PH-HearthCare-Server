import { Prisma } from '.prisma/client';
import { adminSearchableFields } from './admin.constant';
import { calculatePagination } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';

const getAllAdminFromDB = async (
  params: Record<string, unknown>,
  pagiOptions: Record<string, unknown>
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
      })),
    });
  }

  // handle all filterdata here by AND
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: filterData[key] },
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

  return result;
};

export const adminService = {
  getAllAdminFromDB,
};