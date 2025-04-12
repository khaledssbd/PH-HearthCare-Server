import { User } from '@prisma/client';
import prisma from '../shared/prisma';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  return user;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
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
