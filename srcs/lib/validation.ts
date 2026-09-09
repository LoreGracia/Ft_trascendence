import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email"));
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(26, "Password cannot be longer than 26 characters");

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const signupSchema = z.object({
	name: z.string()
		.trim()
		.min(3, "Username must be at least 3 characters")
		.max(20, "Username cannot be longer than 20 characters")
		.regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores"),
		email: emailSchema,
		password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;