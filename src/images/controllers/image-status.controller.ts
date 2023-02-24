import { NextFunction, Request, Response } from 'express';
import { imageFileService } from '../image-file.service';
import { NotFoundError } from '../../common/errors/http.errors';

export const imageStatusController = (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const imageFile = imageFileService.getImageFileByIdSafety(id);

	if (!imageFile) {
		return next(new NotFoundError());
	}

	return res.json({ status: imageFile.status });
};
