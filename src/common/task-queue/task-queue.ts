import {
	TaskHandler,
	DoneHandler,
	TaskQueueOptions,
	TaskProcessingStatus,
} from './task-queue.types';

class TaskQueue<T> {
	private count = 0;
	private readonly waiting: T[] = [];
	private readonly concurrency: number;
	private readonly handler: TaskHandler<T>;
	private readonly done: DoneHandler<T>;

	constructor(concurrency: number, options: TaskQueueOptions<T>) {
		this.done = options.done;
		this.handler = options.process;
		this.concurrency = concurrency;
	}

	add(task: T) {
		if (this.count < this.concurrency) {
			return this.next(task);
		}

		this.waiting.push(task);
	}

	private next(task: T) {
		this.count += 1;
		this.handler(task, (error, data) => {
			if (error) {
				this.done({ status: TaskProcessingStatus.Failure, task, error });
			} else {
				this.done({ status: TaskProcessingStatus.Success, task, data });
			}

			this.count--;
			if (this.waiting.length > 0) {
				const task = this.waiting.shift()!;
				this.next(task);
			}
		});
	}
}

export { TaskQueue };
