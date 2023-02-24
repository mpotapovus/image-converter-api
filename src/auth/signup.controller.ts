import { NextFunction, Request, Response } from 'express';
import { AuthDto } from './auth.dto';
import { authService } from './auth.service';
import { BadRequestError } from '../common/errors/http.errors';

export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body as AuthDto;

	try {
		const jwt = await authService.register(email, password);
		res.status(201).json({ jwt });
	} catch (e) {
		return next(new BadRequestError('Failed to register an account'));
	}
};
