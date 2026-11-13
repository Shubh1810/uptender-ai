import 'server-only';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Standard API error. Throw it from a route handler wrapped in `apiHandler`
 * and it becomes a JSON response: `{ error, code, ...extra }`.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly extra?: Record<string, unknown>
  ) {
    super(message);
  }
}

export const unauthorized = () => new ApiError(401, 'AUTH_ERROR', 'Authentication required');
export const forbidden = (message = 'Forbidden') => new ApiError(403, 'FORBIDDEN', message);
export const badRequest = (message: string, extra?: Record<string, unknown>) =>
  new ApiError(400, 'VALIDATION_ERROR', message, extra);
export const tooManyRequests = () => new ApiError(429, 'RATE_LIMITED', 'Too many requests. Please try again later.');

type Handler<Ctx> = (request: Request, ctx: Ctx) => Promise<Response>;

/**
 * Wraps a route handler so that:
 *  - `ApiError`s become structured JSON responses,
 *  - unexpected errors are logged server-side and return a generic 500
 *    (no stack traces, DB messages or hints leak to the client).
 */
export function apiHandler<Ctx = unknown>(name: string, handler: Handler<Ctx>): Handler<Ctx> {
  return async (request, ctx) => {
    try {
      return await handler(request, ctx);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message, code: error.code, ...error.extra },
          { status: error.status }
        );
      }
      console.error(`[api:${name}] unexpected error`, error);
      return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, { status: 500 });
    }
  };
}

const MAX_BODY_BYTES = 64 * 1024;

/** Parse and validate a JSON body. Throws `ApiError(400)` on bad input. */
export async function parseJson<S extends z.ZodType>(request: Request, schema: S): Promise<z.infer<S>> {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    throw new ApiError(413, 'PAYLOAD_TOO_LARGE', 'Request body too large');
  }

  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw badRequest('Invalid JSON body');
  }

  const result = schema.safeParse(json);
  if (!result.success) {
    throw badRequest('Invalid request data', {
      details: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  return result.data;
}

/** Best-effort client IP (Vercel sets x-forwarded-for). */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Rejects cross-site form/fetch submissions for cookie-authenticated,
 * state-changing endpoints (CSRF defence in depth on top of SameSite=Lax).
 */
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return; // Same-origin navigations/form posts from old browsers may omit it.
  const expected = new URL(request.url).origin;
  if (origin !== expected) throw forbidden('Cross-origin request rejected');
}
