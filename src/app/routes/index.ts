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
  //   route: AuthRoutes,
  // },
  // {
  //   path: '/specialties',
  //   route: SpecialtiesRoutes,
  // },
  // {
  //   path: '/doctor',
  //   route: DoctorRoutes,
  // },
  // {
  //   path: '/patient',
  //   route: PatientRoutes,
  // },
  // {
  //   path: '/schedule',
  //   route: ScheduleRoutes,
  // },
  // {
  //   path: '/doctor-schedule',
  //   route: DoctorScheduleRoutes,
  // },
  // {
  //   path: '/appointment',
  //   route: AppointmentRoutes,
  // },
  // {
  //   path: '/payment',
  //   route: PaymentRoutes,
  // },
  // {
  //   path: '/prescription',
  //   route: PrescriptionRoutes,
  // },
  // {
  //   path: '/review',
  //   route: ReviewRoutes,
  // },
  // {
  //   path: '/meta',
  //   route: MetaRoutes,
  // },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
