import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z
    .string({ message: 'Full name is required.' })
    .trim()
    .min(2, 'Full name must be at least 2 characters.')
    .max(100, 'Full name cannot exceed 100 characters.'),
  email: z
    .string({ message: 'Email is required.' })
    .trim()
    .email('Please enter a valid email address.')
    .max(255, 'Email address cannot exceed 255 characters.'),
  password: z
    .string({ message: 'Password is required.' })
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password cannot exceed 128 characters.'),
});

export const loginSchema = z.object({
  email: z
    .string({ message: 'Email is required.' })
    .trim()
    .email('Please enter a valid email address.'),
  password: z
    .string({ message: 'Password is required.' }),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ message: 'Current password is required.' }),
  newPassword: z
    .string({ message: 'New password is required.' })
    .min(8, 'New password must be at least 8 characters.')
    .max(128, 'New password cannot exceed 128 characters.'),
});
