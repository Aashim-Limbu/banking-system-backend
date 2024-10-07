import AppError from "@/utils/AppError";
import catchAsync from "@/utils/catchError";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { User } from "@/models/UserModel";
import { sendMail } from "@/utils/sendEmail";
import { resetPasswordSchema } from "@/validators/UserSchemaValidators";
import { signToken } from "@/utils/token";
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
export const forgotPassword = catchAsync(async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email: email });
	if (!user) {
		return next(new AppError("There is no User with this email id", 404));
	}
	try {
		const resetToken = user.createResetToken();
		console.log("ResetToken 🥈", resetToken);
		await user.save();
		await sendMail({
			subject: "Reset Password",
			to: email,
			resetUrl: `${req.protocol}://${req.get(
				"host"
			)}/api/users/reset-password/${resetToken}`,
		});
		res.status(200).json({
			status: "success",
			message: "Check your mail",
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetTokenExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new AppError("Error while sending Email", 500));
	}
});
export const resetPassword = catchAsync(async (req, res, next) => {
	const resetToken = crypto
		.createHash("sha256")
		.update(req.params.resetToken)
		.digest("hex");
	const user = await User.findOne({
		passwordResetToken: resetToken,
	});

	if (!user) {
		return next(
			new AppError("Sorry Either token is invalid or don't match at all", 401)
		);
	}
	const { success, error } = resetPasswordSchema.safeParse(req.body);
	if (!success) {
		return next(new AppError(error, 400));
	}
	const { password, passwordConfirm } = req.body;
	user.passwordConfirm = passwordConfirm;
	user.password = password;
	user.passwordResetToken = undefined;
	user.passwordResetTokenExpires = undefined;
	await user.save();
	const token = signToken({ id: user._id.toString() });
	res.status(200).json({
		status: "success",
		message: "Password Reset Successfully",
		token,
	});
});
