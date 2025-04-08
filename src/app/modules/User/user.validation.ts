import { Gender, UserRole, UserStatus } from '@prisma/client';
import { z } from 'zod';

const createAdmin = z.object({
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be string!',
  }),
  admin: z.object({
    name: z.string({
      required_error: 'Name is required!',
      invalid_type_error: 'Name must be string!',
    }),
    email: z.string({
      required_error: 'Email is required!',
      invalid_type_error: 'Email must be string!',
    }),
    contactNumber: z.string({
      required_error: 'Contact Number is required!',
      invalid_type_error: 'Contact Number must be string!',
    }),
  }),
});

const createDoctor = z.object({
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be string!',
  }),
  doctor: z.object({
    name: z.string({
      required_error: 'Name is required!',
      invalid_type_error: 'Name must be string!',
    }),
    email: z.string({
      required_error: 'Email is required!',
      invalid_type_error: 'Email must be string!',
    }),
    contactNumber: z.string({
      required_error: 'Contact Number is required!',
      invalid_type_error: 'Contact Number must be string!',
    }),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: 'Reg number is required',
      invalid_type_error: 'Reg number must be string!',
    }),
    experience: z.number().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z.number({
      required_error: 'Appointment fee is required',
      invalid_type_error: 'Appointment fee must be number!',
    }),
    qualification: z.string({
      required_error: 'Quilification is required',
      invalid_type_error: 'Quilification must be string!',
    }),
    currentWorkingPlace: z.string({
      required_error: 'Current working place is required!',
      invalid_type_error: 'Current working place must be string!',
    }),
    designation: z.string({
      required_error: 'Designation is required!',
      invalid_type_error: 'Designation must be string!',
    }),
  }),
});

const createPatient = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string({
      required_error: 'Name is required!',
      invalid_type_error: 'Name must be string!',
    }),
    email: z
      .string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be string!',
      })
      .email(),
    contactNumber: z.string({
      required_error: 'Contact number is required!',
      invalid_type_error: 'Contact number must be string!',
    }),
    address: z.string({
      required_error: 'Address is required',
      invalid_type_error: 'Address must be string!',
    }),
  }),
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
  }),
});

export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
  updateStatus,
};
