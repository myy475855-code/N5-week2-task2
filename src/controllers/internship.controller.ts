import type { Request, Response } from 'express';
import { getValid } from '../middleware/validate';
import { internshipService } from '../services';
import type { IdParams } from '../schemas/common.schema';
import type {
  InternshipBody,
  InternshipPatchBody,
  ListInternshipsQuery,
} from '../schemas/internship.schema';

export const list = async (_req: Request, res: Response) => {
  const { query } = getValid<{ query: ListInternshipsQuery }>(res);
  res.status(200).json(await internshipService.list(query));
};

export const getOne = async (_req: Request, res: Response) => {
  const { params } = getValid<{ params: IdParams }>(res);
  res.status(200).json({ data: await internshipService.get(params.id) });
};

export const create = async (_req: Request, res: Response) => {
  const { body } = getValid<{ body: InternshipBody }>(res);
  const created = await internshipService.create(body);
  res.status(201).location(`/internships/${created.id}`).json({ data: created });
};

export const replace = async (_req: Request, res: Response) => {
  const { params, body } = getValid<{ params: IdParams; body: InternshipBody }>(res);
  res.status(200).json({ data: await internshipService.replace(params.id, body) });
};

export const patch = async (_req: Request, res: Response) => {
  const { params, body } = getValid<{ params: IdParams; body: InternshipPatchBody }>(res);
  res.status(200).json({ data: await internshipService.patch(params.id, body) });
};

export const remove = async (_req: Request, res: Response) => {
  const { params } = getValid<{ params: IdParams }>(res);
  await internshipService.remove(params.id);
  res.status(204).send();
};
