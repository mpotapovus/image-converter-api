export class HttpError extends Error {
	constructor(readonly statusCode: number, readonly message: string) {
		super();
	}
}

export class UnauthorizedError extends HttpError {
	constructor(message?: string) {
		super(401, message ?? 'Unauthorized');
	}
}

export class BadRequestError extends HttpError {
	constructor(message?: string) {
		super(400, message ?? 'Bad Request');
	}
}

export class NotFoundError extends HttpError {
	constructor(message?: string) {
		super(404, message ?? 'Not found');
	}
}

export class InternalServerError extends HttpError {
	constructor(message?: string) {
		super(500, message ?? 'Internal Server Error');
	}
}
