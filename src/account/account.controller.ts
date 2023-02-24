import { Request, Response } from 'express';
import { AccountUpgradeDto } from './account.dto';
import { accountService } from './account.service';

export const accountUpgradeController = (req: Request, res: Response) => {
	const account = req.account;
	const { credits } = req.body as AccountUpgradeDto;

	const updatedAccount = accountService.updateAccount(account.id, {
		type: 'premium',
		credits: account.credits + credits,
	});

	res.status(200).json(updatedAccount.toDto());
};
