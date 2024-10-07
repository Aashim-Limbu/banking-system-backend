import { Query } from "mongoose";
import { UserDocument } from "@/models/UserModel";
type QueryParam = {
	sort?: string;
	limit?: number;
	page?: number;
	fields?: string;
};
export default class ApiFeature<V extends QueryParam> {
	query: Query<UserDocument[], UserDocument>;
	queryString: Partial<V>;

	constructor(
		query: Query<UserDocument[], UserDocument>,
		queryString: Partial<V>
	) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		let tempQuery = { ...this.queryString };
		const excludeFields = ["page", "limit", "fields"] as const;
		excludeFields.forEach((el) => {
			delete tempQuery[el as keyof V];
		});

		tempQuery = JSON.parse(
			JSON.stringify(tempQuery).replace(
				/\b(gt|gte|lt|lte)\b/g,
				(match) => `$${match}`
			)
		);

		this.query = this.query.find(tempQuery);
		return this;
	}
	sort() {
		let sortBy;
		if (this.queryString.sort) {
			sortBy = this.queryString.sort.split(",").join(" ");
		} else {
			sortBy = "-createdAt";
		}
		this.query = this.query.sort(sortBy);
		return this;
	}
	limit() {
		let limit;
		if (this.queryString.fields) {
			limit = this.queryString.fields.split(",").join(" ");
		} else {
			limit = "-__v";
		}
		this.query = this.query.select(limit);
		return this;
	}
	page() {
		if (this.queryString.page && this.queryString.limit) {
			const page = this.queryString.page * 1;
			const limit = this.queryString.page * 1;
			const skip = (page - 1) * limit;
			this.query = this.query.skip(skip).limit(limit);
		}
		return this;
	}
}
