import { z } from 'zod';

// updateAdminValidationSchema;
const update = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required!',
        invalid_type_error: 'Name must be string!',
      })
      .optional(),
    contactNumber: z
      .string({
        required_error: 'Contact number is required!',
        invalid_type_error: 'Contact number must be string!',
      })
      .optional(),
  }),
});

export const adminValidationSchemas = {
  update,
};
