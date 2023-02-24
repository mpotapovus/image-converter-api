type AccountType = 'basic' | 'premium';

export interface AccountParams {
	id: string;
	email: string;
	passwordHash?: string | null;
	type?: AccountType;
	credits?: number;
	timestamp?: number | null;
	googleId?: string | null;
}

export class Account {
	id: string;
	email: string;
	passwordHash: string | null;
	type: AccountType;
	credits: number;
	timestamp: number | null;
	googleId: string | null;

	constructor(params: AccountParams) {
		this.id = params.id;
		this.email = params.email;
		this.passwordHash = params.passwordHash ?? null;
		this.type = params.type ?? 'basic';
		this.credits = params.credits ?? 0;
		this.timestamp = params.timestamp ?? null;
		this.googleId = params.googleId ?? null;
	}

	toDto() {
		return Object.assign({}, this, { passwordHash: undefined });
	}
}
