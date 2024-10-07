import { Account } from "@/models/bankModel";
import { User } from "@/models/UserModel";
import ApiFeature from "@/utils/ApiFeatures";
import AppError from "@/utils/AppError";
import catchAsync from "@/utils/catchError";
import { signToken } from "@/utils/token";
import {
	UserSigninSchema,
	UserSignupSchema,
} from "@/validators/UserSchemaValidators";
export const signinUser = catchAsync(async (req, res, next) => {
	const { success, error } = UserSigninSchema.safeParse(req.body);
	if (!success) {
		return res.status(400).json({
			status: "Error",
			statusCode: 400,
			error: error.flatten(),
		});
	}

	const user = await User.findOne({ email: req.body.email }).select(
		"+password"
	);
	if (
		!user ||
		!(await user.comparePassword(req.body.password, user.password))
	) {
		return next(new AppError("Incorrect Email or password", 403));
	}

	const token = signToken({ id: user._id.toString() });

	res.status(200).json({
		status: "success",
		statusCode: 200,
		token,
	});
});

export const signupUser = catchAsync(async (req, res, next) => {
	const { success, error } = UserSignupSchema.safeParse(req.body);
	if (!success) {
		return res.status(400).json({
			status: "Error",
			statusCode: 400,
			error: error.flatten(),
		});
	}
	if (await User.findOne({ email: req.body.email }))
		return next(new AppError("User Already Exists", 400));

	const newUser = await User.create(req.body);
	//^Giving User a Random Balance so that we don't have to integrate the payment system to have a balance
	const balance = await Account.create({
		user: newUser._id,
		balance: Math.random() * 1000,
	});
	const token = signToken({ id: newUser._id.toString() });
	res.status(201).json({
		status: "Success",
		statusCode: 201,
		data: {
			message: "User created Successfully",
			token,
			balance: `Alloted Balance is ${balance.balance}`,
		},
	});
});
export const getAllUser = catchAsync(async (req, res, next) => {
	const { query } = new ApiFeature(User.find(), req.query)
		.sort()
		.filter()
		.limit()
		.page();
	const users = await User.find(query).populate("account");
	res.status(200).json({
		status: "success",
		statusCode: 200,
		data: users,
	});
});
export const getUser = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const user = await User.findById(id);
	if (!user) return next(new AppError("User not Found", 404));
	res.status(200).json({
		status: "success",
		statusCode: 200,
		data: user,
	});
});
