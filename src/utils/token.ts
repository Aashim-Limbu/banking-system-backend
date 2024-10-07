import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
export function signToken(id: { id: string }) {
	if (!process.env.JWT_SECRETKEY) {
		throw new Error("JWT_SECRETKEY is not defined in environment variables");
	}
	return jwt.sign(id, process.env.JWT_SECRETKEY, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
}
