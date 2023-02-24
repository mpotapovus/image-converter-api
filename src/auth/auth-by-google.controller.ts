import { NextFunction, Request, Response } from 'express';
import { AuthByGoogleDto } from './auth.dto';
import { authService } from './auth.service';
import { BadRequestError } from '../common/errors/http.errors';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { accountService } from '../account/account.service';
import { Config } from '../config/config';

initializeApp(Config.firebaseConfig);

const auth = getAuth();

export const authByGoogleIndex = async (req: Request, res: Response, next: NextFunction) => {
	res.render('google');
};

export const authByGoogleController = async (req: Request, res: Response, next: NextFunction) => {
	const { credentials } = req.body as AuthByGoogleDto;

	try {
		const credential = GoogleAuthProvider.credential(credentials);
		const { user } = await signInWithCredential(auth, credential);

		if (!user.email) {
			return next(new BadRequestError('Email is required'));
		}

		const account = accountService.findAccountByGoogleIdSafety(user.uid);

		let jwt: string;

		if (!account) {
			jwt = await authService.registerFromGoogle(user.email, user.uid);
		} else {
			jwt = await authService.loginFromGoogle(user.uid);
		}

		res.status(200).json({ jwt });
	} catch (e) {
		next(new BadRequestError('Failed to login by google'));
	}
};
