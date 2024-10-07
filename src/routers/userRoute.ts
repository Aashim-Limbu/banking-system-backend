import * as authController from "@/controllers/authController";
import {
	getAllUser,
	getUser,
	signinUser,
	signupUser,
} from "@/controllers/userController";
import express from "express";
const userRouter = express.Router();
userRouter.route("/signin").post(signinUser);
userRouter.route("/signup").post(signupUser);
userRouter.route("/forgot-password").post(authController.forgotPassword);
userRouter
	.route("/reset-password/:resetToken")
	.patch(authController.resetPassword);
userRouter.use(authController.protect);
userRouter.route("/").get(getAllUser);
userRouter.route("/:id").get(getUser);
export default userRouter;
