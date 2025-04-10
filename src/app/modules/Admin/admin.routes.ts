import express from 'express';
import { adminController } from './admin.controller';

const router = express.Router();

router.get('/', adminController.getAllAdmin);

router.get('/:id', adminController.getAdminById);

router.patch('/:id', adminController.updateAdmin);

router.delete('/:id', adminController.deleteAdmin);

router.delete('/soft/:id', adminController.softDeleteAdmin);

export const adminRoutes = router;
