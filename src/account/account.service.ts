import { nanoid } from 'nanoid';
import { Account, AccountParams } from './account.entity';

const MockBasicAccount = new Account({
	id: '1',
	email: 'test@test.ru',
	type: 'basic',
	credits: 11,
	passwordHash: '$2a$10$GzdpxK9XtiabGeKUZe7Wm.u7ix25pJqhbwVCYQch.RS6Ce6nEa5b.', //qwerty
});

const MockPremiumAccount = new Account({
	id: '2',
	email: 'test2@test.ru',
	type: 'premium',
	credits: 11,
	passwordHash: '$2a$10$GzdpxK9XtiabGeKUZe7Wm.u7ix25pJqhbwVCYQch.RS6Ce6nEa5b.', //qwerty
});

export class AccountService {
	private accounts: Account[] = [MockBasicAccount, MockPremiumAccount];

	isAccountExist(email: string): boolean {
		return !!this.accounts.find((user) => user.email === email);
	}

	findAccountByGoogleIdSafety(googleId: string): Account | null {
		return this.accounts.find((user) => user.googleId === googleId) ?? null;
	}

	findAccountByGoogleId(googleId: string): Account {
		return this.findByOrThrow('googleId', googleId);
	}

	findAccountByEmail(email: string): Account {
		return this.findByOrThrow('email', email);
	}

	findAccountById(id: string): Account {
		return this.findByOrThrow('id', id);
	}

	findByOrThrow(name: keyof Account, value: unknown) {
		const account = this.accounts.find((account) => account[name] === value);

		if (!account) {
			throw new Error('Account not found');
		}

		return account;
	}

	createAccount(email: string, passwordHash: string | null, googleId?: string): Account {
		const account = new Account({ id: nanoid(), email, passwordHash, credits: 20, googleId });

		this.accounts.push(account);

		return account;
	}

	updateAccount(id: string, patch: Partial<AccountParams>): Account {
		const account = this.findAccountById(id);
		const updatedAccount = new Account({
			...account,
			...patch,
		});

		this.accounts = this.accounts.filter((account) => account.id !== updatedAccount.id);
		this.accounts.push(updatedAccount);

		return updatedAccount;
	}
}

export const accountService = new AccountService();
