import { Admin, Doctor, Gender, Patient } from '@prisma/client';

export type TAdminPayload = {
  password: string;
  admin: {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto: string;
  };
};

export type TDoctorPayload = {
  password: string;
  doctor: {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto: string;
    address?: string;
    registrationNumber: string;
    experience?: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
  };
};

export type TPatientPayload = {
  password: string;
  patient: {
    name: string;
    email: string;
    contactNumber: string;
    address: string;
    profilePhoto: string;
  };
};

export type TUpdateProfileData = Admin | Doctor | Patient;
