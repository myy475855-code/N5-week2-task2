import type { Request, Response } from 'express';
import { getValid } from '../middleware/validate';
import { applicationService } from '../services';
import type { IdParams } from '../schemas/common.schema';
import type {
  CreateApplicationBody,
  ListApplicationsQuery,
  UpdateStatusBody,
} from '../schemas/application.schema';

export const listForInternship = async (_req: Request, res: Response) => {
  const { params, query } = getValid<{ params: IdParams; query: ListApplicationsQuery }>(res);
  res.status(200).json(await applicationService.listForInternship(params.id, query));
};

export const createForInternship = async (_req: Request, res: Response) => {
  const { params, body } = getValid<{ params: IdParams; body: CreateApplicationBody }>(res);
  const created = await applicationService.create(params.id, body);
  res.status(201).location(`/applications/${created.id}`).json({ data: created });
};

export const getOne = async (_req: Request, res: Response) => {
  const { params } = getValid<{ params: IdParams }>(res);
  res.status(200).json({ data: await applicationService.get(params.id) });
};

export const updateStatus = async (_req: Request, res: Response) => {
  const { params, body } = getValid<{ params: IdParams; body: UpdateStatusBody }>(res);
  res.status(200).json({ data: await applicationService.updateStatus(params.id, body.status, body.note) });
};
