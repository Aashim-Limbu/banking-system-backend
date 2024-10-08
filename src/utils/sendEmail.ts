import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: process.env.SENDER_EMAIL,
		pass: process.env.SENDER_PASSWORD,
	},
});
export async function sendMail(option: {
	subject: string;
	to: string;
	resetUrl: string;
}) {
	console.log({
		user: process.env.SENDER_EMAIL,
		pass: process.env.SENDER_PASSWORD,
	});
	await transporter.sendMail({
		from: process.env.SENDER_EMAIL,
		subject: option.subject,
		text: `Visit ${option.resetUrl} to reset Password. Do give password and confirm Password. `,
		to: option.to,
	});
}
