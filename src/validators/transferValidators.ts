import { z } from "zod";

export const transferSchema = z.object({
	balance: z
		.number({ required_error: "Balance is Required" })
		.positive("Balance Must be positive and non Zero"),
	to: z.string({ required_error: "Reciever ID is required" }),
});
