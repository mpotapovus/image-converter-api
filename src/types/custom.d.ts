declare namespace Express {
	import { Account } from '../account/account.entity';
	export interface Request {
		account: Account;
	}
}
