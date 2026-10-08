import type { ApplicationRepository, InternshipRepository } from '../data/repositories';
import { ALLOWED_TRANSITIONS, canTransition } from '../domain/applicationStatus';
import type { ApplicationStatus } from '../domain/applicationStatus';
import { conflict, notFound } from '../errors/AppError';
import type { ApplicationFilter, NewApplication } from '../types/models';

export class ApplicationService {
  constructor(
    private readonly applications: ApplicationRepository,
    private readonly internships: InternshipRepository,
  ) {}

  async create(internshipId: string, input: Omit<NewApplication, 'internshipId'>) {
    const internship = await this.internships.findById(internshipId);
    if (!internship) throw notFound('Internship', internshipId);

    if (internship.status === 'closed') {
      throw conflict('INTERNSHIP_CLOSED', 'This internship is no longer accepting applications');
    }
    if (internship.deadline && new Date(internship.deadline).getTime() < Date.now()) {
      throw conflict('APPLICATION_DEADLINE_PASSED', 'The application deadline has passed', {
        deadline: internship.deadline,
      });
    }

    const duplicate = await this.applications.findByInternshipAndEmail(
      internshipId,
      input.applicantEmail,
    );
    if (duplicate) {
      throw conflict(
        'DUPLICATE_APPLICATION',
        'An application from this email already exists for this internship',
        { applicationId: duplicate.id },
      );
    }

    return this.applications.create({ ...input, internshipId });
  }

  async listForInternship(internshipId: string, filter: ApplicationFilter) {
    if (!(await this.internships.findById(internshipId))) {
      throw notFound('Internship', internshipId);
    }
    const { items, total } = await this.applications.findByInternshipId(internshipId, filter);
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

  async get(id: string) {
    const found = await this.applications.findById(id);
    if (!found) throw notFound('Application', id);
    return found;
  }

  /** Enforces the status state machine. Illegal moves -> 409. */
  async updateStatus(id: string, to: ApplicationStatus, note?: string) {
    const current = await this.get(id);

    if (!canTransition(current.status, to)) {
      const allowed = ALLOWED_TRANSITIONS[current.status];
      throw conflict(
        'ILLEGAL_STATUS_TRANSITION',
        `Cannot change application status from '${current.status}' to '${to}'. ` +
          (allowed.length
            ? `Allowed next status: ${allowed.join(', ')}.`
            : `'${current.status}' is a final status.`),
        { from: current.status, to, allowed },
      );
    }

    const updated = await this.applications.updateStatus(id, to, note);
    if (!updated) throw notFound('Application', id); // deleted concurrently
    return updated;
  }
}
