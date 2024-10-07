import AppError from "@/utils/AppError";
import catchAsync from "@/utils/catchError";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "@/models/UserModel";
dotenv.config();
export const protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.includes("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	if (!token) {
		return next(new AppError("You're not authorized to this route", 401));
	}
	const decoded = jwt.verify(token, process.env.JWT_SECRETKEY!) as JwtPayload;
	const freshUser = await User.findById(decoded.id);
	if (!freshUser) {
		next(new AppError("Token no longer valid Please re-login", 401));
	}
	req.user = freshUser;
	next();
});
