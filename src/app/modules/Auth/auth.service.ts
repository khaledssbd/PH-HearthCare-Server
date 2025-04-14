// import { UserStatus } from '@prisma/client';
// import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import { JwtPayload, Secret } from 'jsonwebtoken';
import emailSender from './emailSender';
import config from '../../config';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { findUser } from '../../../helpers/authHelpers';

// loginUserIntoDB
const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  // const user = await prisma.user.findUniqueOrThrow({
  //   where: {
  //     email: payload.email,
  //     status: UserStatus.ACTIVE,
  //   },
  // });

  const user = await findUser({ email: payload.email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  if (user.status === 'DELETED') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account is deleted!');
  }
  if (user.status === 'BLOCKED') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account is blocked!');
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isCorrectPassword) {
    throw new Error('Password incorrect!');
  }
  const accessToken = jwtHelpers.createToken(
    {
      email: user.email,
      role: user.role,
    },
    config.jwt.access_secret as Secret,
    config.jwt.access_secter_expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      email: user.email,
      role: user.role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_secret_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

// refreshToken
const refreshToken = async (token: string) => {
  const decodedData = jwtHelpers.verifyToken(
    token,
    config.jwt.refresh_secret as Secret
  );

  // const user = await prisma.user.findUniqueOrThrow({
  //   where: {
  //     email: decodedData.email,
  //     status: UserStatus.ACTIVE,
  //   },
  // });

  const user = await findUser({ email: decodedData.email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  if (user.status === 'DELETED') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account is deleted!');
  }
  if (user.status === 'BLOCKED') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account is blocked!');
  }

  const accessToken = jwtHelpers.createToken(
    {
      email: user.email,
      role: user.role,
    },
    config.jwt.access_secret as Secret,
    config.jwt.access_secter_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: user.needPasswordChange,
  };
};

// changePassword
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // const user = await prisma.user.findUniqueOrThrow({
  //   where: {
  //     email: userData.email,
  //     status: UserStatus.ACTIVE,
  //   },
  // });

  const user = await findUser({ email: userData.email });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    user?.password as string
  );

  if (!isCorrectPassword) {
    throw new Error('Password incorrect!');
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: {
      email: user?.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: 'Password changed successfully!',
  };
};

// forgotPassword
const forgotPassword = async (payload: { email: string }) => {
  const user = await findUser({ email: payload.email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  if (user.status === 'DELETED') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account is deleted!');
  }
  if (user.status === 'BLOCKED') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account is blocked!');
  }

  // const user = await prisma.user.findUniqueOrThrow({
  //   where: {
  //     email: payload.email,
  //     status: UserStatus.ACTIVE,
  //   },
  // });

  const resetPassToken = jwtHelpers.createToken(
    { email: user.email, role: user.role },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_secret_expires_in as string
  );

  const resetPassLink =
    config.reset_pass_ui_link + `?userId=${user.id}&token=${resetPassToken}`;

  await emailSender(
    user.email,
    `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
  );
};

// resetPassword
const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  // const user = await prisma.user.findUniqueOrThrow({
  //   where: {
  //     id: payload.id,
  //     status: UserStatus.ACTIVE,
  //   },
  // });

  // check if the token is missing
  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
  }

  const user = await findUser({ id: payload.id });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  if (user.status === 'DELETED') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account is deleted!');
  }
  if (user.status === 'BLOCKED') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account is blocked!');
  }

  // check if the token is expired or valid
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden!');
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};

export const AuthServices = {
  loginUserIntoDB,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
