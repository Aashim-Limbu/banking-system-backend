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
userRouter.use(authController.protect);
userRouter.route("/").get(getAllUser);
userRouter.route("/:id").get(getUser);
export default userRouter;
