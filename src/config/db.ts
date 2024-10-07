import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DB_STRING = process.env.DB_CONNECTION_STRING?.replace(
	"<db_password>",
	process.env.DB_PASSWORD!
) as string;
const connectDb = async () => {
	try {
		return await mongoose.connect(DB_STRING);
	} catch (error) {
		console.error("Error connecting to database: ", error);
		throw error;
	}
};

export default connectDb;
