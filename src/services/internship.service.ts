import type { ApplicationRepository, InternshipRepository } from '../data/repositories';
import { notFound } from '../errors/AppError';
import type { Internship, InternshipFilter } from '../types/models';

export class InternshipService {
  constructor(
    private readonly internships: InternshipRepository,
    private readonly applications: ApplicationRepository,
  ) {}

  async list(filter: InternshipFilter) {
    const { items, total } = await this.internships.findAll(filter);
    return {
      data: items,
      meta: {
        page: filter.page,
        limit: filter.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / filter.limit)),
      },
    };
  }

  async get(id: string): Promise<Internship> {
    const found = await this.internships.findById(id);
    if (!found) throw notFound('Internship', id);
    return found;
  }

  create(data: Parameters<InternshipRepository['create']>[0]) {
    return this.internships.create(data);
  }

  async replace(id: string, data: Parameters<InternshipRepository['replace']>[1]) {
    const updated = await this.internships.replace(id, data);
    if (!updated) throw notFound('Internship', id);
    return updated;
  }

  async patch(id: string, patch: Parameters<InternshipRepository['update']>[1]) {
    const updated = await this.internships.update(id, patch);
    if (!updated) throw notFound('Internship', id);
    return updated;
  }

  /** Deleting a posting cascades to its applications. */
  async remove(id: string): Promise<void> {
    const deleted = await this.internships.delete(id);
    if (!deleted) throw notFound('Internship', id);
    await this.applications.deleteByInternshipId(id);
  }
}
