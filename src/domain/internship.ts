export const CATEGORIES = [
  'engineering',
  'design',
  'data',
  'product',
  'marketing',
  'finance',
  'operations',
  'other',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const INTERNSHIP_STATUSES = ['open', 'closed'] as const;
export type InternshipStatus = (typeof INTERNSHIP_STATUSES)[number];

export const INTERNSHIP_SORT_FIELDS = ['createdAt', 'title', 'stipend', 'deadline'] as const;
export type InternshipSortField = (typeof INTERNSHIP_SORT_FIELDS)[number];
