import express from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validations';

const router = express.Router();

router.get('/', adminController.getAllAdmin);

router.get('/:id', adminController.getAdminById);

router.patch(
  '/:id',
  validateRequest(adminValidationSchemas.update),
  adminController.updateAdmin
);

router.delete('/:id', adminController.deleteAdmin);

router.delete('/soft/:id', adminController.softDeleteAdmin);

export const adminRoutes = router;
