import type { Request, RequestHandler, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { AppError } from '../errors/AppError';

interface Schemas {
  params?: ZodTypeAny;
  query?: ZodTypeAny;
  body?: ZodTypeAny;
}

/**
 * Schema-driven validation. Parsed (coerced + defaulted) values are stored on
 * res.locals.valid; controllers read them with getValid() and never touch raw input.
 * Failures become 422 VALIDATION_ERROR with one detail entry per issue.
 */
export const validate =
  (schemas: Schemas): RequestHandler =>
  (req: Request, res, next) => {
    const valid: Record<string, unknown> = {};
    const details: { location: string; path: string; message: string; code: string }[] = [];

    for (const key of ['params', 'query', 'body'] as const) {
      const schema = schemas[key];
      if (!schema) continue;
      const result = schema.safeParse(req[key] ?? {});
      if (result.success) {
        valid[key] = result.data;
      } else {
        for (const issue of result.error.issues) {
          details.push({
            location: key,
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          });
        }
      }
    }

    if (details.length > 0) {
      throw new AppError(422, 'VALIDATION_ERROR', 'Request validation failed', details);
    }
    res.locals.valid = valid;
    next();
  };

export function getValid<T>(res: Response): T {
  return res.locals.valid as T;
}
