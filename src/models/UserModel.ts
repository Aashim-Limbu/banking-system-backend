import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"; //for salting
export interface UserDocument extends Document {
	email: string;
	password: string;
	comparePassword(
		candidatePassword: string,
		userPassword: string
	): Promise<boolean>;
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
			minLength: [8, "A password must be greater than 8"],
			maxLength: [30, "Please keep the password below 30"],
			select: false,
			required: [true, "Password is requied"],
		},
		firstName: String,
		lastName: String,
	},
	{
		timestamps: true,
	}
);
userSchema.pre("save", async function (next) {
	this.password = await bcrypt.hash(this.password, 12);
	next();
});
userSchema.methods.comparePassword = async function (
	candidatePassword: string,
	userPassword: string
) {
	return bcrypt.compare(candidatePassword, userPassword);
};

export const User = mongoose.model<UserDocument>("User", userSchema);
