/** Operational error that maps 1:1 onto the JSON error envelope. */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const notFound = (resource: string, id: string) =>
  new AppError(404, `${resource.toUpperCase()}_NOT_FOUND`, `${resource} with id '${id}' was not found`);

export const conflict = (code: string, message: string, details?: unknown) =>
  new AppError(409, code, message, details);
