import { z } from 'zod';
import { APPLICATION_STATUSES } from '../domain/applicationStatus';
import { pagination } from './common.schema';

export const createApplicationBody = z
  .object({
    applicantName: z.string().trim().min(2).max(100),
    applicantEmail: z.string().trim().toLowerCase().email(),
    resumeUrl: z.string().trim().url().max(500),
    coverLetter: z.string().trim().min(1).max(5000).optional(),
    availability: z
      .object({
        startDate: z.string().date('startDate must be YYYY-MM-DD'),
        hoursPerWeek: z.number().int().min(1).max(60),
      })
      .strict()
      .optional(),
  })
  .strict();
export type CreateApplicationBody = z.infer<typeof createApplicationBody>;

export const updateStatusBody = z
  .object({
    status: z.enum(APPLICATION_STATUSES),
    note: z.string().trim().min(1).max(500).optional(),
  })
  .strict();
export type UpdateStatusBody = z.infer<typeof updateStatusBody>;

export const listApplicationsQuery = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  ...pagination,
});
export type ListApplicationsQuery = z.infer<typeof listApplicationsQuery>;
