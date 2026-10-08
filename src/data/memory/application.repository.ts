import { randomUUID } from 'node:crypto';
import type { ApplicationRepository } from '../repositories';
import type { Application, ApplicationFilter, NewApplication, Page } from '../../types/models';
import type { ApplicationStatus } from '../../domain/applicationStatus';

export class InMemoryApplicationRepository implements ApplicationRepository {
  private store = new Map<string, Application>();

  async findByInternshipId(internshipId: string, f: ApplicationFilter): Promise<Page<Application>> {
    let items = [...this.store.values()].filter((a) => a.internshipId === internshipId);
    if (f.status) items = items.filter((a) => a.status === f.status);
    items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
    const total = items.length;
    const start = (f.page - 1) * f.limit;
    return { items: items.slice(start, start + f.limit), total };
  }

  async findById(id: string) {
    return this.store.get(id) ?? null;
  }

  async findByInternshipAndEmail(internshipId: string, email: string) {
    const e = email.toLowerCase();
    return (
      [...this.store.values()].find(
        (a) => a.internshipId === internshipId && a.applicantEmail.toLowerCase() === e,
      ) ?? null
    );
  }

  async create(data: NewApplication) {
    const now = new Date().toISOString();
    const app: Application = {
      ...data,
      id: randomUUID(),
      status: 'submitted',
      statusHistory: [{ from: null, to: 'submitted', at: now }],
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(app.id, app);
    return app;
  }

  async updateStatus(id: string, to: ApplicationStatus, note?: string) {
    const existing = this.store.get(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    const next: Application = {
      ...existing,
      status: to,
      updatedAt: now,
      statusHistory: [
        ...existing.statusHistory,
        { from: existing.status, to, at: now, ...(note ? { note } : {}) },
      ],
    };
    this.store.set(id, next);
    return next;
  }

  async deleteByInternshipId(internshipId: string) {
    let n = 0;
    for (const [id, a] of this.store) {
      if (a.internshipId === internshipId) {
        this.store.delete(id);
        n++;
      }
    }
    return n;
  }
}
