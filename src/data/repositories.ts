import type {
  Application,
  ApplicationFilter,
  InternshipFilter,
  Internship,
  NewApplication,
  NewInternship,
  Page,
} from '../types/models';
import type { ApplicationStatus } from '../domain/applicationStatus';

/**
 * Repository contracts. Everything is async and framework-agnostic so a
 * PostgreSQL implementation (Task 4) can replace the in-memory one by changing
 * ONLY src/data/index.ts. Routes, controllers and services stay untouched.
 */
export interface InternshipRepository {
  findAll(filter: InternshipFilter): Promise<Page<Internship>>;
  findById(id: string): Promise<Internship | null>;
  create(data: NewInternship): Promise<Internship>;
  /** Full replacement (PUT semantics). Returns null if not found. */
  replace(id: string, data: NewInternship): Promise<Internship | null>;
  /** Partial update (PATCH semantics). Returns null if not found. */
  update(id: string, patch: Partial<NewInternship>): Promise<Internship | null>;
  delete(id: string): Promise<boolean>;
}

export interface ApplicationRepository {
  findByInternshipId(internshipId: string, filter: ApplicationFilter): Promise<Page<Application>>;
  findById(id: string): Promise<Application | null>;
  findByInternshipAndEmail(internshipId: string, email: string): Promise<Application | null>;
  create(data: NewApplication): Promise<Application>;
  updateStatus(id: string, to: ApplicationStatus, note?: string): Promise<Application | null>;
  deleteByInternshipId(internshipId: string): Promise<number>;
}
