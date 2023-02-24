import { Router } from 'express';
import { authByGoogleDtoSchema, authDtoSchema } from '../auth/auth.dto';
import { signInController } from '../auth/signin.controller';
import { signUpController } from '../auth/signup.controller';
import { bodyValidator } from '../common/middlewares/body-validator';
import { authByGoogleController, authByGoogleIndex } from '../auth/auth-by-google.controller';

export const authRoutes = Router();

authRoutes.post('/signup', bodyValidator(authDtoSchema), signUpController);
authRoutes.post('/signin', bodyValidator(authDtoSchema), signInController);

authRoutes.get('/google', authByGoogleIndex);
authRoutes.post('/google', bodyValidator(authByGoogleDtoSchema), authByGoogleController);
