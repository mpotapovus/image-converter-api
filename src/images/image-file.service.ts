import { ImageFile, ImageFileParams } from './image-file.entity';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import sharp, { FormatEnum } from 'sharp';
import { join } from 'node:path';
import { Config } from '../config/config';

export class ImageFileService {
	private images: ImageFile[] = [];

	getImageFileByIdSafety(id: string): ImageFile | null {
		return this.images.find((image) => image.id === id) ?? null;
	}

	getImageFileById(id: string): ImageFile {
		const imageFile = this.getImageFileByIdSafety(id);

		if (!imageFile) {
			throw new Error('File not exist');
		}

		return imageFile;
	}

	saveImageFileStream(imageFile: ImageFile) {
		this.images.push(imageFile);
	}

	getImageStream(id: string) {
		const imageFile = this.getImageFileByIdSafety(id);

		if (!imageFile) {
			throw new Error('File not exist');
		}

		return createReadStream(this.getOutPath(imageFile.outName));
	}

	updateImageFile(id: string, patch: Partial<Omit<ImageFileParams, 'id'>>) {
		const imageFile = this.getImageFileById(id);
		const updatedImageFile = new ImageFile({ ...imageFile, ...patch });

		this.images = this.images.filter((item) => item.id !== updatedImageFile.id);
		this.images.push(updatedImageFile);
	}

	convertImageTo(id: string) {
		const imageFile = this.getImageFileByIdSafety(id);

		if (!imageFile) {
			throw new Error('File not exist');
		}

		const src = this.getSourcePath(imageFile.srcName);
		const out = this.getOutPath(imageFile.outName);

		const convert = sharp().toFormat(imageFile.outExtname as keyof FormatEnum);
		const read = createReadStream(src);
		const write = createWriteStream(out);
		return pipeline(read, convert, write);
	}

	private getSourcePath(name: string) {
		return join(Config.srcFiles, name);
	}

	private getOutPath(name: string) {
		return join(Config.outFiles, name);
	}
}

export const imageFileService = new ImageFileService();
