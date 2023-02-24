import { NextFunction, Request, Response } from 'express';
import { imageFileService } from '../image-file.service';
import { NotFoundError } from '../../common/errors/http.errors';

export const imageDownloadController = (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const imageFile = imageFileService.getImageFileByIdSafety(id);

	if (!imageFile || imageFile.status !== 'success') {
		return next(new NotFoundError());
	}

	imageFileService.getImageStream(imageFile.id).pipe(res);
};
