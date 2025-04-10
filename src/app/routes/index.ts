import { Router } from 'express';
import { userRoutes } from '../modules/User/user.routes';
import { adminRoutes } from '../modules/Admin/admin.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  // {
  //   path: '/auth',
  //   route: authRoutes,
  // },
  // {
  //   path: '/specialties',
  //   route: specialtiesRoutes,
  // },
  // {
  //   path: '/doctor',
  //   route: doctorRoutes,
  // },
  // {
  //   path: '/patient',
  //   route: patientRoutes,
  // },
  // {
  //   path: '/schedule',
  //   route: scheduleRoutes,
  // },
  // {
  //   path: '/doctor-schedule',
  //   route: doctorScheduleRoutes,
  // },
  // {
  //   path: '/appointment',
  //   route: appointmentRoutes,
  // },
  // {
  //   path: '/payment',
  //   route: paymentRoutes,
  // },
  // {
  //   path: '/prescription',
  //   route: prescriptionRoutes,
  // },
  // {
  //   path: '/review',
  //   route: reviewRoutes,
  // },
  // {
  //   path: '/meta',
  //   route: metaRoutes,
  // },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
