import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "lon11@ethereal.email",
		pass: "1qfuYUaCvjHa5qmFRs",
	},
});
export async function sendMail(option: {
	subject: string;
	to: string;
	resetUrl: string;
}) {
	await transporter.sendMail({
		from: process.env.SENDER_EMAIL,
		subject: option.subject,
		text: `Visit ${option.resetUrl} to reset Password. Do give password and confirm Password. `,
		to: option.to,
	});
}
