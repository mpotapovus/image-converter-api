import { ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors/http.errors';

interface Schema {
	safeParse: (obj: unknown) => { success: true } | { success: false; error: ZodError };
}
export const bodyValidator = (schema: Schema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const parseResult = schema.safeParse(req.body);

		if (parseResult.success) {
			return next();
		}

		next(new BadRequestError(parseResult.error as any));
	};
};
