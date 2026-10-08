# TalentBridge Internships API

Layered REST API (Node 20+, Express 5, TypeScript, Zod) for internship postings and applications.
Data is in-memory for now; the repository layer is the seam for PostgreSQL in Task 4.

## Run it

```bash
npm install
cp .env.example .env      # PORT, NODE_ENV, SEED_DATA
npm run dev               # http://localhost:3000   |   Swagger UI at /docs
npm run build && npm start
```

Import `postman/TalentBridge.postman_collection.json` and run it top-to-bottom (Collection Runner);
it chains `internshipId` / `applicationId` automatically and asserts every status code.

## Architecture

```
src/
  routes/        URL + HTTP verb -> validate(schema) -> controller. No logic.
  controllers/   Read validated input, call a service, choose the status code.
  services/      Business rules (state machine, duplicates, closed postings). No Express imports.
  data/          Repository interfaces + in-memory implementations. Only layer that knows storage.
  schemas/       Zod schemas (single source of truth for input shape + inferred TS types).
  middleware/    validate(), errorHandler, notFound
  errors/        AppError -> JSON error envelope
  domain/        Enums + application status state machine
```

**Swapping to PostgreSQL (Task 4):** implement `InternshipRepository` / `ApplicationRepository`
(`src/data/repositories.ts`) with SQL and change the two lines in `src/data/index.ts`.
Routes, controllers and services do not change. Repositories are async and take plain filter
objects (`InternshipFilter`) so filtering/sorting/pagination maps directly to `WHERE/ORDER BY/LIMIT`.

## Endpoints

| Method | Path | Success | Notes |
|---|---|---|---|
| GET | /internships | 200 | `location, category, status, q, sortBy, order, page, limit` |
| POST | /internships | 201 | `Location` header |
| GET | /internships/:id | 200 | |
| PUT | /internships/:id | 200 | full replace (idempotent) |
| PATCH | /internships/:id | 200 | partial, at least one field |
| DELETE | /internships/:id | 204 | cascades to applications |
| GET | /internships/:id/applications | 200 | `status, page, limit` |
| POST | /internships/:id/applications | 201 | starts as `submitted` |
| GET | /applications/:id | 200 | includes `statusHistory` |
| PATCH | /applications/:id/status | 200 | state machine, 409 if illegal |

## Status codes

| Code | When |
|---|---|
| 200 / 201 / 204 | read-update / create / delete |
| 400 | malformed JSON (`INVALID_JSON`) |
| 404 | unknown resource or route |
| 409 | valid request, conflicting state: `ILLEGAL_STATUS_TRANSITION`, `DUPLICATE_APPLICATION`, `INTERNSHIP_CLOSED`, `APPLICATION_DEADLINE_PASSED` |
| 413 | body > 100kb |
| 422 | schema validation failed (body, query or params), `details[]` lists each issue |
| 500 | unexpected (message hidden in production) |
| 401 / 403 | reserved: no auth in this task |

Error envelope (every failure): `{ "error": { "code": "...", "message": "...", "details": ... } }`

## Application status state machine

```
submitted -> under_review -> accepted
                          -> rejected      (accepted / rejected are final)
```
Re-sending the current status is also a 409 (the request is not a valid transition).

## Design decisions
- `{ data, meta }` envelope on success so metadata can be added without breaking clients.
- `.strict()` schemas: unknown fields are rejected (422) rather than silently dropped.
- Nested/optional fields (`contact`, `availability`, `skills[]`) are fully validated.
- PUT vs PATCH: PUT replaces the whole resource (omitted optionals are removed); PATCH merges.
- Deleting an internship cascades to its applications (documented in OpenAPI).
