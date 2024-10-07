import { Request, Response, NextFunction } from "express";
type CustomRequestType = Request & { user?: any };
const catchAsync =
	<T>(
		func: (
			req: CustomRequestType,
			res: Response,
			next: NextFunction
		) => Promise<T>
	) =>
	(req: Request, res: Response, next: NextFunction) => {
		func(req, res, next).catch(next);
	};
export default catchAsync;
