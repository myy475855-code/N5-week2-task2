# Design notes

> Written as a starting point. Before submitting, open the real docs and confirm each point
> yourself, and put it in your own words.

## 3 conventions adopted from public APIs

1. **Stripe: list responses wrap results** in an object (`data` array plus paging info) instead of a bare array,
   so metadata can be added later without a breaking change. I use `{ data, meta: { page, limit, total, totalPages } }`.
2. **GitHub: `Location` header on `201 Created`** pointing at the new resource, and `422 Unprocessable Entity` for
   validation failures with a list of per-field problems. I use both (`details[]` with `location`, `path`, `message`).
3. **Stripe: machine-readable error `code` separate from human `message`** so clients branch on the code,
   not on text. I use stable codes like `ILLEGAL_STATUS_TRANSITION`.

## Comparison with RFC 9457 (Problem Details for HTTP APIs)

RFC 9457 defines `application/problem+json` with members `type` (URI identifying the problem type),
`title`, `status`, `detail`, `instance`, plus arbitrary extension members.

| This API | RFC 9457 |
|---|---|
| `error.code` (string like `VALIDATION_ERROR`) | `type` (a URI, ideally dereferenceable docs) |
| `error.message` | `detail` (occurrence-specific) and `title` (same for every occurrence) |
| `error.details` | extension members, e.g. an `errors` array |
| HTTP status only in the status line | `status` repeated in body |
| `Content-Type: application/json` | `Content-Type: application/problem+json` |
| nested under `error` | flat top-level object |
| no `instance` | `instance` identifies this specific occurrence |

**Take-aways:** the envelope carries the same ideas, but is not standards-compliant. Moving to RFC 9457 would mean:
flat body, `type` as a URI, add `title`/`status`/`instance`, and the `application/problem+json` media type.
The benefit is tooling and clients that already understand it; the cost is that the task spec mandates the
`{ error: { code, message, details? } }` shape, so I kept it and documented the mapping.
