import { randomUUID } from 'node:crypto';
import type { InternshipRepository } from '../repositories';
import type { Internship, InternshipFilter, NewInternship, Page } from '../../types/models';

const norm = (v: unknown) => (typeof v === 'string' ? v.toLowerCase() : v);

export class InMemoryInternshipRepository implements InternshipRepository {
  private store = new Map<string, Internship>();

  async findAll(f: InternshipFilter): Promise<Page<Internship>> {
    let items = [...this.store.values()];

    if (f.location) {
      const loc = f.location.toLowerCase();
      items = items.filter((i) => i.location.toLowerCase().includes(loc));
    }
    if (f.category) items = items.filter((i) => i.category === f.category);
    if (f.status) items = items.filter((i) => i.status === f.status);
    if (f.q) {
      const q = f.q.toLowerCase();
      items = items.filter((i) =>
        [i.title, i.company, i.description].some((s) => s.toLowerCase().includes(q)),
      );
    }

    const dir = f.order === 'asc' ? 1 : -1;
    items.sort((a, b) => {
      const av = norm(a[f.sortBy]) as string | number | undefined;
      const bv = norm(b[f.sortBy]) as string | number | undefined;
      if (av === undefined && bv === undefined) return 0;
      if (av === undefined) return 1; // missing values always last
      if (bv === undefined) return -1;
      if (av < bv) return -dir;
      if (av > bv) return dir;
      return 0;
    });

    const total = items.length;
    const start = (f.page - 1) * f.limit;
    return { items: items.slice(start, start + f.limit), total };
  }

  async findById(id: string) {
    return this.store.get(id) ?? null;
  }

  async create(data: NewInternship) {
    const now = new Date().toISOString();
    const internship: Internship = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.store.set(internship.id, internship);
    return internship;
  }

  async replace(id: string, data: NewInternship) {
    const existing = this.store.get(id);
    if (!existing) return null;
    const next: Internship = {
      ...data,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.store.set(id, next);
    return next;
  }

  async update(id: string, patch: Partial<NewInternship>) {
    const existing = this.store.get(id);
    if (!existing) return null;
    const next: Internship = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    this.store.set(id, next);
    return next;
  }

  async delete(id: string) {
    return this.store.delete(id);
  }
}
