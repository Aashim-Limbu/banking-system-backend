import { z } from "zod";
export const UserSigninSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.email("Invalid Email"),
	password: z.string({ required_error: "Password is required" }),
});
export const UserSignupSchema = z.object({
	firstName: z
		.string({ required_error: "firstName is required" })
		.min(3, "firstName must be greater than 3"),
	lastName: z
		.string({ required_error: "lastName is required" })
		.min(3, "lastName Must be greater than 3"),
	email: z
		.string({ required_error: "email is required" })
		.email("Invalid Email"),
	password: z
		.string({ required_error: "password is required" })
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			"Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
		),
});
