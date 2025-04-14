import { UserRole } from '@prisma/client';
import prisma from '../src/shared/prisma';
import bcrypt from 'bcrypt';
import config from './../src/app/config';

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      // console.log('Super admin already exists!');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.superAdmin.password as string,
      Number(config.bcrypt_salt_rounds)
    );

    await prisma.user.create({
      data: {
        email: config.superAdmin.email as string,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: config.superAdmin.name as string,
            //email: config.superAdmin.email as string,
            contactNumber: config.superAdmin.contact_number as string,
          },
        },
      },
    });

    // console.log('Super Admin Created Successfully!', superAdminData);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
