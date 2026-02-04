import { z } from "zod";

export const forgotPasswordStep1Schema = z.object({
  email: z.string().email("Invalid email address").trim(),
});

export type ForgotPasswordStep1Input = z.infer<
  typeof forgotPasswordStep1Schema
>;

export const forgotPasswordStep2Schema = z.object({
  email: z.string().email().trim(),
  otp: z
    .string()
    .min(4, "OTP must be at least 4 digits")
    .max(6, "OTP must be at most 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

export type ForgotPasswordStep2Input = z.infer<
  typeof forgotPasswordStep2Schema
>;
