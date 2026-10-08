import { applicationRepository, internshipRepository } from '../data';
import { ApplicationService } from './application.service';
import { InternshipService } from './internship.service';

export const internshipService = new InternshipService(internshipRepository, applicationRepository);
export const applicationService = new ApplicationService(applicationRepository, internshipRepository);
