import { UserRole } from '@prisma/client';

export type IAuthUser = {
  email: string;
  role: UserRole;
  // iat?: number; used it manually in verifyToken function
};
