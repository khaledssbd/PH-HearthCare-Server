import { PrismaClient, UserRole } from '@prisma/client';
import config from '../../config';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(
    data.password,
    config.bcrypt_salt_rounds as string
  );

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transectionClient) => {
    await transectionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transectionClient.admin.create({
      data: data.admin,
    });

    return createdAdminData;
  });

  return result;
};

export const userService = {
  createAdmin,
};
