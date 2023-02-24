import { z } from 'zod';

export const authDtoSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export type AuthDto = z.infer<typeof authDtoSchema>;

export const authByGoogleDtoSchema = z.object({
	credentials: z.string(),
});

export type AuthByGoogleDto = z.infer<typeof authByGoogleDtoSchema>;
