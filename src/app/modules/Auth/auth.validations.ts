import { z } from 'zod';
// in zod by default every field is required.. for optional must use .optional()

// loginUserValidationSchema using zod
const loginUser = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be string!',
      })
      .trim()
      .email({ message: 'Invalid email address!' }),

    password: z
      .string({
        required_error: 'Password is required!',
        invalid_type_error: 'Password must be a string!',
      })
      .min(8, { message: "Password can't be less then 8 characters!" })
      .max(20, { message: "Password can't be more then 20 characters!" }),
  }),
});

// refreshTokenValidationSchema
const refreshToken = z.object({
  headers: z.object({
    authorization: z.string({
      required_error: 'Refresh token is required!',
      invalid_type_error: 'Refresh token must be string!',
    }),
  }),
});

// changePassword validation using zod
const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required!',
      invalid_type_error: 'Old password must be string!',
    }),

    newPassword: z
      .string({
        required_error: 'New Password is required!',
        invalid_type_error: 'New password must be string!',
      })
      .min(8, { message: "New password can't be less then 8 characters!" })
      .max(20, { message: "New password can't be more then 20 characters!" }),
  }),
});

// updateProfile validation using zod
const updateProfile = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Name must be string!',
        required_error: 'Name is required!',
      })
      .trim()
      .min(5, { message: 'Name must have minimum 5 characters!' })
      .max(30, { message: "Name can't exceed 30 characters!" }),
  }),
});

// forgotPassword validation using zod
const forgotPassword = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be string!',
      })
      .trim()
      .email({ message: 'Invalid email address!' }),
  }),
});

// resetPassword validation using zod
const resetPassword = z.object({
  body: z.object({
    newPassword: z
      .string({
        required_error: 'New Password is required!',
        invalid_type_error: 'New password must be string!',
      })
      .min(8, { message: "New password can't be less then 8 characters!" })
      .max(20, { message: "New password can't be more then 20 characters!" }),
  }),

  query: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
        invalid_type_error: 'Email must be string!',
      })
      .trim()
      .email({ message: 'Invalid email address!' }),

    token: z
      .string({
        required_error: 'Token is required!',
        invalid_type_error: 'Token must be string!',
      })
      .min(50, { message: "New password can't be less then 50 characters!" }),
  }),
});

export const authValidationSchemas = {
  loginUser,
  refreshToken,
  changePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
};
