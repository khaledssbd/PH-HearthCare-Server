import { User } from '@prisma/client';
import prisma from '../shared/prisma';
import bcrypt from 'bcrypt';

export const findUser = async (data: Partial<User>): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: data,
  });

  return user;
};

export const isPasswordMatched = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const isTokenIssuedBeforePasswordChange = async (
  passwordChangedAt: Date,
  jwtIssuedAt: number
): Promise<boolean> => {
  const passwordChangedTime = new Date(passwordChangedAt).getTime() / 1000;
  return passwordChangedTime > jwtIssuedAt;
};
