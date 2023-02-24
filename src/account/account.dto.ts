import { z } from 'zod';

export const accountUpgradeDtoSchema = z.object({
	credits: z.number().int().gt(0),
});

export type AccountUpgradeDto = z.infer<typeof accountUpgradeDtoSchema>;
