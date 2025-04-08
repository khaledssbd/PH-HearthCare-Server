import express from 'express';
import { adminController } from './admin.controller';

const router = express.Router();

router.post('/', adminController.getAllAdmin);

export const adminRoutes = router;
