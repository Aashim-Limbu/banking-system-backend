import * as authController from "@/controllers/authController";
import * as accountController from "@/controllers/account.Controller";
import express from "express";
const accountRouter = express.Router();
accountRouter.use(authController.protect);
accountRouter.route("/").get(accountController.getBalance);
accountRouter.route("/transfer").post(accountController.balanceTransfer);
export default accountRouter;
