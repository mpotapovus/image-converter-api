import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { Config } from '../config/config';
import { accountService, AccountService } from '../account/account.service';

export type AuthJWTPayload = { accountId: string };

export interface JWT<T> {
	payload: T;
}

export class AuthService {
	private salt = Config.salt;
	private secret = Config.secret;

	constructor(private readonly accountService: AccountService) {}

	async login(email: string, password: string): Promise<string> {
		const account = this.accountService.findAccountByEmail(email);
		const isCompare = account.passwordHash && (await compare(password, account.passwordHash));

		if (!isCompare) {
			throw Error('Incorrect password');
		}

		return this.signJWT({ accountId: account.id });
	}

	async register(email: string, password: string): Promise<string> {
		const isAccountExist = this.accountService.isAccountExist(email);

		if (isAccountExist) {
			throw Error('Email already registered');
		}

		const passwordHash = await this.getPasswordHash(password);
		const account = this.accountService.createAccount(email, passwordHash);

		return this.signJWT({ accountId: account.id });
	}

	async registerFromGoogle(email: string, googleId: string): Promise<string> {
		const isAccountExist = this.accountService.isAccountExist(email);

		if (isAccountExist) {
			throw Error('Email already registered');
		}

		const account = this.accountService.createAccount(email, null, googleId);

		return this.signJWT({ accountId: account.id });
	}

	async loginFromGoogle(googleId: string): Promise<string> {
		const account = this.accountService.findAccountByGoogleId(googleId);
		return this.signJWT({ accountId: account.id });
	}

	async verifyJWT<T>(jwt: string): Promise<JWT<T>> {
		return new Promise((resolve, reject) => {
			verify(jwt, this.secret, (err, payload) => {
				if (err) {
					return reject(err);
				}

				resolve(payload as JWT<T>);
			});
		});
	}

	async signJWT(payload: unknown): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					payload,
				},
				this.secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}

	private async getPasswordHash(password: string): Promise<string> {
		return hash(password, this.salt);
	}
}

export const authService = new AuthService(accountService);
