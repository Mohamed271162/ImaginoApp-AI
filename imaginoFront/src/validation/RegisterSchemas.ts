import { z } from "zod";

export const registerStep1Schema = z
  .object({
    email: z.string().email("Invalid email address").trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterStep1Input = z.infer<typeof registerStep1Schema>;

export const registerStep2Schema = z.object({
  email: z.string().email().trim(), 
  otp: z
    .string()
    .min(4, "OTP must be at least 4 digits")
    .max(6, "OTP must be at most 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

export type RegisterStep2Input = z.infer<typeof registerStep2Schema>;

export const registerStep3Schema = z.object({
  email: z.string().email().trim(),
  countryCode: z
    .string()
    .min(1, "Country code is required")
    .regex(/^\+?\d+$/, "Invalid country code"),
  phone: z
    .string()
    .min(6, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^\d+$/, "Phone must contain only digits"),
});

export type RegisterStep3Input = z.infer<typeof registerStep3Schema>;
