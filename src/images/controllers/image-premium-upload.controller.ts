import { extname } from 'path';
import { NextFunction, Request, Response } from 'express';
import { ImageFile } from '../image-file.entity';
import { imagePremiumQueue } from '../image.queue';
import { imageFileService } from '../image-file.service';
import { accountService } from '../../account/account.service';
import { BadRequestError } from '../../common/errors/http.errors';

export const imagePremiumUploadController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const account = req.account;
	const credits = account.credits;
	const timestamp = account.timestamp ?? Date.now();

	if (credits <= 0) {
		accountService.updateAccount(account.id, {
			type: 'basic',
			credits: 0,
			timestamp: Date.now(),
		});

		return next(new BadRequestError('Upload limit exceeded. Your account converted to basic'));
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
	imagePremiumQueue.add({ imageFileId: imageFile.id });
	accountService.updateAccount(account.id, {
		timestamp,
		credits: account.credits - 1,
	});

	res.json({ id: imageFile.id });
};
