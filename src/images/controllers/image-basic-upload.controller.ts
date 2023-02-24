import dayjs from 'dayjs';
import { extname } from 'path';
import { NextFunction, Request, Response } from 'express';
import { ImageFile } from '../image-file.entity';
import { imageBasicQueue } from '../image.queue';
import { imageFileService } from '../image-file.service';
import { accountService } from '../../account/account.service';
import { BadRequestError } from '../../common/errors/http.errors';

export const imageBasicUploadController = (req: Request, res: Response, next: NextFunction) => {
	const account = req.account;
	let credits = account.credits;
	let timestamp = account.timestamp ?? Date.now();
	const countDaysAgo = dayjs(Date.now()).diff(timestamp, 'days');

	if (countDaysAgo > 0) {
		credits = 20;
		timestamp = Date.now();
	}

	if (credits <= 0) {
		return next(new BadRequestError('Upload limit exceeded'));
	}

	const file = req.file!;
	const format = req.body.format!;
	const nameWithExt = file.filename;
	const ext = extname(nameWithExt);
	const nameWithoutExt = nameWithExt.replace(ext, '');

	const imageFile = new ImageFile({
		id: nameWithoutExt,
		srcExtname: ext.replace('.', ''),
		outExtname: format,
		status: 'pending',
	});

	imageFileService.saveImageFileStream(imageFile);
	imageBasicQueue.add({ imageFileId: imageFile.id });
	accountService.updateAccount(account.id, {
		timestamp,
		credits: account.credits - 1,
	});

	res.json({ id: imageFile.id });
};
