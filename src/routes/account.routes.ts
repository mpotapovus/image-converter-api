import { Router } from 'express';
import { accountUpgradeDtoSchema } from '../account/account.dto';
import { bodyValidator } from '../common/middlewares/body-validator';
import { accountUpgradeController } from '../account/account.controller';

export const accountRoutes = Router();

accountRoutes.post(
	'/buy-credits',
	bodyValidator(accountUpgradeDtoSchema),
	accountUpgradeController,
);
