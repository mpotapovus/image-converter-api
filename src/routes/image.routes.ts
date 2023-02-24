import { Router } from 'express';
import { premiumGuard } from '../auth/guards.middleware';
import { imageStatusController } from '../images/controllers/image-status.controller';
import { imageDownloadController } from '../images/controllers/image-download.controller';
import { imagePremiumUploadController } from '../images/controllers/image-premium-upload.controller';
import { imageUploadMiddleware } from '../common/middlewares/image-upload.middleware';
import { imageBasicUploadController } from '../images/controllers/image-basic-upload.controller';
import { imageFreeUploadController } from '../images/controllers/image-free-upload.controller';

export const imageRoutes = Router();

imageRoutes.get('/status/:id', imageStatusController);

imageRoutes.get('/download/:id', imageDownloadController);

imageRoutes.post('/upload', imageUploadMiddleware, (req, res, next) => {
	req.account
		? imageBasicUploadController(req, res, next)
		: imageFreeUploadController(req, res, next);

	next();
});

imageRoutes.post(
	'/premium-upload',
	premiumGuard,
	imageUploadMiddleware,
	imagePremiumUploadController,
);
