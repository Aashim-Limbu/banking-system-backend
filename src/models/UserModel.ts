import mongoose, { Query, Schema } from "mongoose";
import bcrypt from "bcrypt"; //for salting
import crypto from "crypto";
export interface UserDocument extends Document {
	email: string;
	password: string;
	passwordConfirm: string | undefined;
	passwordResetToken: string | undefined;
	passwordResetTokenExpires: unknown;
	passwordChangedAt: Date;
	comparePassword(
		candidatePassword: string,
		userPassword: string
	): Promise<boolean>;
	createResetToken(): string;
	validateToken(param: Date): boolean;
}
const userSchema = new Schema(
	{
		email: {
			type: String,
			trim: true,
			unique: true,
			required: [true, "Email is required"],
		},
		password: {
			type: String,
			minLength: [8, "A password must be greater than 8 character"],
			maxLength: [30, "A password must be lesser than 30 character"],
			select: false,
			required: [true, "Password is requied"],
		},

		passwordConfirm: {
			type: String,
			validate: {
				validator: function (this: UserDocument, pass: string): boolean {
					return this.password === pass;
				},
				message: "Password don't match",
			},
		},
		firstName: String,
		lastName: String,
		passwordResetToken: String,
		passwordResetTokenExpires: Date,
		passwordChangedAt: Date,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userSchema.virtual("account", {
	ref: "Account",
	foreignField: "user",
	localField: "_id",
});
userSchema.methods.comparePassword = async function (
	candidatePassword: string,
	userPassword: string
) {
	return bcrypt.compare(candidatePassword, userPassword);
};
userSchema.method("createResetToken", function () {
	const resetToken = crypto.randomBytes(32).toString("hex"); //bcrypt is used for hashing only as it is computation expensive
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
	console.log("Token Expires At", new Date(Date.now() + 10 * 60 * 1000));
	return resetToken;
});
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	console.log("password", this.password);
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});
userSchema.methods.validateToken = function (
	this: UserDocument,
	jwttimestamp: Date
) {
	if (this.passwordChangedAt) {
		return this.passwordChangedAt > jwttimestamp;
	}
	return false;
};
userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) next();
	this.passwordChangedAt = new Date(Date.now() - 1000);
	next();
});

export const User = mongoose.model<UserDocument>("User", userSchema);
