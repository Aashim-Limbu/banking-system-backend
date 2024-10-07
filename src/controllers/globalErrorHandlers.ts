import express, { NextFunction, Response, Request } from "express";
import AppError from "@/utils/AppError";
export default function ErrorHandler(
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	res.status(statusCode).json({
		status: err.status,
		statusCode: statusCode,
		message: message,
		stack: err.stack,
		error: err,
	});
}
