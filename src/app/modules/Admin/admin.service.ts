import { Prisma } from '.prisma/client';
import { adminSearchableFields } from './admin.constant';
import { calculatePagination } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';

const getAllAdminFromDB = async (
  params: Record<string, unknown>,
  pagiOptions: Record<string, unknown>
) => {
  const { searchTerm, ...filterdata } = params;
  const { limit, page, sortBy, sortOrder } = calculatePagination(pagiOptions);
  const andCondition: Prisma.AdminWhereInput[] = [];

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

  if (Object.keys(filterdata).length > 0) {
    andCondition.push({
      AND: Object.keys(filterdata).map((key) => ({
        [key]: { equals: filterdata[key] },
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
    //   sortBy && sortOrder
    //     ? { [sortBy as string]: sortOrder }
    //     : { createdAt: 'desc' },
  });

  return result;
};

export const adminService = {
  getAllAdminFromDB,
};