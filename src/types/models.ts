import type { Category, InternshipSortField, InternshipStatus } from '../domain/internship';
import type { ApplicationStatus } from '../domain/applicationStatus';

export interface Contact {
  name: string;
  email: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  category: Category;
  stipend?: number;
  deadline?: string; // ISO 8601
  skills?: string[];
  contact?: Contact;
  status: InternshipStatus;
  createdAt: string;
  updatedAt: string;
}
export type NewInternship = Omit<Internship, 'id' | 'createdAt' | 'updatedAt'>;

export interface InternshipFilter {
  location?: string;
  category?: Category;
  status?: InternshipStatus;
  q?: string;
  sortBy: InternshipSortField;
  order: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface Availability {
  startDate: string; // YYYY-MM-DD
  hoursPerWeek: number;
}

export interface StatusChange {
  from: ApplicationStatus | null;
  to: ApplicationStatus;
  at: string;
  note?: string;
}

export interface Application {
  id: string;
  internshipId: string;
  applicantName: string;
  applicantEmail: string;
  resumeUrl: string;
  coverLetter?: string;
  availability?: Availability;
  status: ApplicationStatus;
  statusHistory: StatusChange[];
  createdAt: string;
  updatedAt: string;
}
export type NewApplication = Omit<
  Application,
  'id' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'
>;

export interface ApplicationFilter {
  status?: ApplicationStatus;
  page: number;
  limit: number;
}

export interface Page<T> {
  items: T[];
  total: number;
}
