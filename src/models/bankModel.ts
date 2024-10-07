import mongoose, { Document, ObjectId, Query, Schema } from "mongoose";
import { UserDocument } from "./UserModel";

export interface AccountDocument extends Document {
	balance: number;
	user: ObjectId | UserDocument;
}

const accountSchema = new Schema({
	balance: {
		type: Number,
		validate: {
			validator: function (v: number) {
				return v >= 0;
			},
			message: "Balance must be a non-negative number",
		},
	},
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

accountSchema.pre<Query<AccountDocument, UserDocument>>(
	/^find/,
	function (next) {
		this.populate({
			path: "user",
		});
		next();
	}
);

export const Account = mongoose.model<AccountDocument>(
	"Account",
	accountSchema
);
