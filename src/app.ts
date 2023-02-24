import morgan from 'morgan';
import express from 'express';
import { routes } from './routes';
import cookieParser from 'cookie-parser';
import { identify } from './auth/identify.middleware';
import { errorHandler } from './common/middlewares/error.handler';
import { join } from 'node:path';

export const createApp = () => {
	const app = express();
	app.set('view engine', 'ejs');
	app.set('views', join(__dirname, 'views'));
	app.use(morgan('dev'));
	app.use(express.json());
	app.use(cookieParser());
	app.use(identify);
	app.use(routes);
	app.use(errorHandler);

	return app;
};
