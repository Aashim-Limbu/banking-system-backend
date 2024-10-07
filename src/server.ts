import { app } from "./app";
import connectDb from "./config/db";
const port: number = Number(process.env.PORT) || 8000;
process.on("uncaughtException", (err: unknown) => {
	if (err instanceof Error) {
		console.log("Uncaught Exception: Shutting Down");
		console.log({ name: err.name, message: err.message });
	} else {
		console.log("Uncaught Exception: Shutting Down");
		console.log({ message: err });
	}
	process.exit(1);
});

const server = app.listen(port, async () => {
	const response = await connectDb();
	if (response) console.log("DB connected Successfully ");
	console.log(`Server is Listening on ${port}`);
});
process.on("unhandledRejection", (err: unknown) => {
	if (err instanceof Error) {
		console.log("Unhandled Rejection: Shutting Down");
		console.log({ name: err.name, message: err.message });
	} else {
		console.log("Unhandled Rejection: Shutting Down");
		console.log({ message: err });
	}

	server.close(() => {
		process.exit(1);
	});
});
