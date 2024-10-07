import { Account, AccountDocument } from "@/models/bankModel";
import AppError from "@/utils/AppError";
import catchAsync from "@/utils/catchError";
import { transferSchema } from "@/validators/transferValidators";
import mongoose from "mongoose";

export const getBalance = catchAsync(async (req, res, next) => {
	const userId = req.user._id;
	const balanceDetails = await Account.findOne({ user: userId });
	res.status(200).json({
		status: "success",
		data: {
			balance: balanceDetails,
		},
	});
});
export const balanceTransfer = catchAsync(async (req, res, next) => {
	const { success, error } = transferSchema.safeParse(req.body);
	if (!success || error) {
		return next(new AppError(error, 400));
	}
	const session = await mongoose.startSession();
	const { balance, to } = req.body;
	session.startTransaction();
	try {
		const holder = (await Account.findOne({
			user: req.user._id,
		}).session(session)) as AccountDocument;
		if (holder.balance < balance) {
			await session.abortTransaction();
			session.endSession();
			return next(new AppError("Insufficient Balance", 400));
		}
		const reciever = await Account.findOne({ user: to }).session(session);
		if (!reciever) {
			await session.abortTransaction();
			session.endSession();
			return next(new AppError("Sorry, the Receiver not Found", 400));
		}
		const holderD = await Account.findOneAndUpdate(
			{ user: holder.user },
			{ balance: holder.balance - balance },
			{ new: true, runValidators: true }
		).session(session);

		const recieverD = await Account.findOneAndUpdate(
			{ user: reciever.user },
			{ balance: reciever.balance + balance },
			{ new: true, runValidators: true }
		).session(session);
		await session.commitTransaction(); // Commit transaction
		session.endSession(); // End transaction

		res.status(200).json({
			status: "Transaction Success",
			data: {
				recieverD,
				holderD,
			},
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.log(error);
		next(new AppError("Transaction failed", 500));
	}
});
