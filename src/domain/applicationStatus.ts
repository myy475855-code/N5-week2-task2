export const APPLICATION_STATUSES = ['submitted', 'under_review', 'accepted', 'rejected'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/**
 * State machine: the single source of truth for legal transitions.
 * accepted / rejected are terminal states.
 */
export const ALLOWED_TRANSITIONS: Readonly<Record<ApplicationStatus, readonly ApplicationStatus[]>> = {
  submitted: ['under_review'],
  under_review: ['accepted', 'rejected'],
  accepted: [],
  rejected: [],
};

export function canTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}
