import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

const getAllAdmin = async () => {
  const result = await prisma.admin.findMany();

  return result;
};

export const adminService = {
  getAllAdmin,
};
