import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../common/errors/http.errors';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
	return req.account ? next() : next(new UnauthorizedError());
};

export const premiumGuard = (req: Request, res: Response, next: NextFunction) => {
	const isPremium = req.account?.type === 'premium';

	return isPremium ? next() : next(new UnauthorizedError('Only premium account available'));
};
