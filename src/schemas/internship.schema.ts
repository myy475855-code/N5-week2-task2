import { z } from 'zod';
import { CATEGORIES, INTERNSHIP_SORT_FIELDS, INTERNSHIP_STATUSES } from '../domain/internship';
import { pagination } from './common.schema';

const contact = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().toLowerCase().email(),
  })
  .strict();

const internshipFields = z
  .object({
    title: z.string().trim().min(3).max(120),
    company: z.string().trim().min(2).max(120),
    description: z.string().trim().min(20).max(5000),
    location: z.string().trim().min(2).max(120),
    category: z.enum(CATEGORIES),
    stipend: z.number().nonnegative().max(1_000_000).optional(),
    deadline: z.string().datetime({ offset: true }).optional(),
    skills: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
    contact: contact.optional(),
    status: z.enum(INTERNSHIP_STATUSES).default('open'),
  })
  .strict();

/** POST + PUT: full representation */
export const internshipBody = internshipFields;
export type InternshipBody = z.infer<typeof internshipBody>;

/** PATCH: any subset, but not empty */
export const internshipPatchBody = internshipFields
  .partial()
  .refine((o) => Object.keys(o).length > 0, { message: 'At least one field must be provided' });
export type InternshipPatchBody = z.infer<typeof internshipPatchBody>;

export const listInternshipsQuery = z.object({
  location: z.string().trim().min(1).optional(),
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(INTERNSHIP_STATUSES).optional(),
  q: z.string().trim().min(1).max(100).optional(),
  sortBy: z.enum(INTERNSHIP_SORT_FIELDS).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  ...pagination,
});
export type ListInternshipsQuery = z.infer<typeof listInternshipsQuery>;
