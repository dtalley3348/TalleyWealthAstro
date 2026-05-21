import type { APIRoute } from 'astro';

const PLATFORM_API_BASE_URL = import.meta.env.PLATFORM_API_BASE_URL || '';

export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export async function proxyOrLocalSuccess(
  request: Request,
  platformPath: string,
  localBody: Record<string, unknown>,
): Promise<Response> {
  const body = await readJson(request);
  if (!body) return json(400, { ok: false, error: 'invalid_json' });

  if (!PLATFORM_API_BASE_URL) {
    return json(200, {
      ok: true,
      localOnly: true,
      ...localBody,
    });
  }

  const target = `${PLATFORM_API_BASE_URL.replace(/\/$/, '')}${platformPath}`;
  const res = await fetch(target, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  });
}

export type StandaloneApiRoute = APIRoute;
