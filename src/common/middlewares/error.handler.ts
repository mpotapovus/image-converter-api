import { NextFunction, Request, Response } from 'express';
import { HttpError, InternalServerError } from '../errors/http.errors';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
	const error = err instanceof HttpError ? err : new InternalServerError();

	console.error(err);
	res.status(error.statusCode).send({ error: error.message });
};
