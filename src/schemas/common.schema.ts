import { z } from 'zod';

export const idParams = z.object({ id: z.string().uuid('id must be a valid UUID') });
export type IdParams = z.infer<typeof idParams>;

export const pagination = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
};
