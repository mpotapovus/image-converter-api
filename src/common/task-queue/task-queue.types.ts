enum TaskProcessingStatus {
	Success = 'success',
	Failure = 'failure',
}
interface DoneSuccess<T, D = unknown> {
	status: TaskProcessingStatus.Success;
	task: T;
	data: D;
}

interface DoneFailure<T, E = unknown> {
	status: TaskProcessingStatus.Failure;
	task: T;
	error: E;
}

type TaskHandler<T> = (task: T, cb: (err: unknown, data: unknown) => void) => void;
type DoneHandler<T> = (payload: DoneSuccess<T> | DoneFailure<T>) => void;

interface TaskQueueOptions<T> {
	process: TaskHandler<T>;
	done: DoneHandler<T>;
}

export {
	DoneSuccess,
	DoneFailure,
	TaskHandler,
	DoneHandler,
	TaskQueueOptions,
	TaskProcessingStatus,
};
