import { z } from "zod";
const testSchema = z.object({
	name: z.string({
		required_error: "Name is required",
		invalid_type_error: "Must be String",
	}),
	age: z.number({
		required_error: "Age is required",
		invalid_type_error: "Must be Number",
	}),
});
const { success, error } = testSchema.safeParse({name:"Aashim"});
if (error) {
	console.log(error.issues[0]);
}
