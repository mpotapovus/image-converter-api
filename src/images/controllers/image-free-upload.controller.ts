import dayjs from 'dayjs';
import { extname } from 'path';
import { NextFunction, Request, Response } from 'express';
import { imageBasicQueue } from '../image.queue';
import { ImageFile } from '../image-file.entity';
import { imageFileService } from '../image-file.service';
import { BadRequestError } from '../../common/errors/http.errors';

export const imageFreeUploadController = (req: Request, res: Response, next: NextFunction) => {
	let credits = Number(req.cookies.credits);
	let timestamp = Number(req.cookies.timestamp);

	if (!Number.isSafeInteger(credits) || !dayjs(timestamp).isValid()) {
		credits = 0;
		timestamp = Date.now();
	}

	const countMonthAgo = dayjs(Date.now()).diff(timestamp, 'month');

	if (countMonthAgo > 0) {
		credits = 0;
		timestamp = Date.now();
	}

	if (credits >= 20) {
		return next(new BadRequestError('Upload limit exceeded'));
	}

	const file = req.file!;
	const format = req.body.format!;
	const nameWithExt = file.filename;
	const ext = extname(nameWithExt);
	const nameWithoutExt = nameWithExt.replace(ext, '');

	if (ext !== '.jpg' || format !== 'webp') {
		return next(new BadRequestError('Unsupported format'));
	}

	const imageFile = new ImageFile({
		id: nameWithoutExt,
		srcExtname: ext.replace('.', ''),
		outExtname: format,
		status: 'pending',
	});

	imageFileService.saveImageFileStream(imageFile);
	imageBasicQueue.add({ imageFileId: imageFile.id });

	res.cookie('credits', credits + 1);
	res.cookie('timestamp', timestamp);

	res.json({ id: imageFile.id });
};
