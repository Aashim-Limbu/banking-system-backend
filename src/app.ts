import cors from "cors";
import express from "express";
import AppError from "./utils/AppError";
import ErrorHandler from "./controllers/globalErrorHandlers";
import userRouter from "./routers/userRoute";
import accountRouter from "./routers/accountRouter";
export const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/account", accountRouter);
app.use("*", (req, res, next) => {
	next(
		new AppError(
			`Unhandled Route ${req.originalUrl} not defined. You are Lost sorry`,
			404
		)
	);
});
app.use(ErrorHandler);
