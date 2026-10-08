import type { ApplicationRepository, InternshipRepository } from './repositories';
import { InMemoryApplicationRepository } from './memory/application.repository';
import { InMemoryInternshipRepository } from './memory/internship.repository';

/**
 * Composition root for the data layer.
 * Task 4: replace these two lines with the PostgreSQL implementations.
 */
export const internshipRepository: InternshipRepository = new InMemoryInternshipRepository();
export const applicationRepository: ApplicationRepository = new InMemoryApplicationRepository();
