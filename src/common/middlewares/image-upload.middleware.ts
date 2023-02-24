import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'node:path';
import { Config } from '../../config/config';

const BYTES_IN_MB = 1048576;
const FILE_SIZE_LIMIT = BYTES_IN_MB * 50;

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		return cb(null, Config.srcFiles);
	},
	filename: (req, file, cb) => {
		const extname = path.extname(file.originalname);
		const name = `${nanoid()}.${extname}`;
		return cb(null, name);
	},
});

export const MulterConfig: multer.Options = {
	storage,
	limits: { fileSize: FILE_SIZE_LIMIT },
};

export const imageUploadMiddleware = multer(MulterConfig).single('file');
