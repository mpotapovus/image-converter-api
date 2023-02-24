import { NextFunction, Request, Response } from 'express';
import { AuthDto } from './auth.dto';
import { authService } from './auth.service';
import { BadRequestError } from '../common/errors/http.errors';

export const signInController = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body as AuthDto;

	try {
		const jwt = await authService.login(email, password);
		res.status(200).json({ jwt });
	} catch (e) {
		next(new BadRequestError('Failed to login the account. Check login and password'));
	}
};
