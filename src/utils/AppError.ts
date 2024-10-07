import { ZodError } from "zod";

export default class AppError extends Error {
	statusCode: number;
	status: string;
	isOperational: boolean;

	constructor(message: string | Error | ZodError, statusCode: number) {
		if (message instanceof ZodError) {
			super(
				message.issues.map((issue) => issue.message).join("\n") ||
					"Zod Validation Error"
			);
		} else if (message instanceof Error) {
			super(message.message);
		} else {
			super(message);
		}
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "Failed" : "Error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}
