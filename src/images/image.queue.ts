import { imageFileService } from './image-file.service';
import { DoneHandler, TaskHandler, TaskProcessingStatus, TaskQueue } from '../common/task-queue';

interface ImageTask {
	imageFileId: string;
}

const processHandler: TaskHandler<ImageTask> = async ({ imageFileId }, cb) => {
	try {
		const imageFile = imageFileService.getImageFileById(imageFileId);
		await imageFileService.convertImageTo(imageFile.id);
		cb(null, {});
	} catch (e) {
		cb(e, null);
	}
};

const doneHandler: DoneHandler<ImageTask> = (payload) => {
	const imageFile = imageFileService.getImageFileByIdSafety(payload.task.imageFileId);

	if (!imageFile) {
		return;
	}

	if (payload.status === TaskProcessingStatus.Success) {
		return imageFileService.updateImageFile(imageFile.id, { status: 'success' });
	}

	if (payload.status === TaskProcessingStatus.Failure) {
		console.error(payload.error);
		return imageFileService.updateImageFile(imageFile.id, { status: 'failure' });
	}
};

export const imageBasicQueue = new TaskQueue<{ imageFileId: string }>(2, {
	process: processHandler,
	done: doneHandler,
});

export const imagePremiumQueue = new TaskQueue<{ imageFileId: string }>(10, {
	process: processHandler,
	done: doneHandler,
});
