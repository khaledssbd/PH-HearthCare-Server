import express from 'express';
import { AuthController as authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { authValidationSchemas } from './auth.validations';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidationSchemas.loginUser),
  authController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(authValidationSchemas.refreshToken),
  authController.refreshToken
);

router.post(
  '/change-password',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  validateRequest(authValidationSchemas.changePassword),
  authController.changePassword
);

router.post(
  '/forgot-password',
  validateRequest(authValidationSchemas.forgotPassword),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  validateRequest(authValidationSchemas.resetPassword),
  authController.resetPassword
);

export const authRoutes = router;
