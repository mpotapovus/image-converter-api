import { NextFunction, Request, Response } from 'express';
import { AuthJWTPayload, authService } from './auth.service';
import { accountService } from '../account/account.service';

export const identify = async (req: Request, res: Response, next: NextFunction) => {
	const jwt = req.headers.authorization?.replace('Bearer ', '');

	if (jwt) {
		try {
			const { payload } = await authService.verifyJWT<AuthJWTPayload>(jwt);

			req.account = accountService.findAccountById(payload.accountId);
		} catch (_) {}
	}

	next();
};
