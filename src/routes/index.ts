import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { imageRoutes } from './image.routes';
import { accountRoutes } from './account.routes';
import { authGuard } from '../auth/guards.middleware';

export const routes = Router();

routes.get('/', (req, res) => {
	res.send('Hello world!');
});
routes.use('/auth', authRoutes);
routes.use('/image', imageRoutes);
routes.use('/account', authGuard, accountRoutes);
