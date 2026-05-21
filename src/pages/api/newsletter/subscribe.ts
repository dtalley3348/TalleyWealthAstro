import { json, readJson, type StandaloneApiRoute } from '../../../lib/platform-api';

export const prerender = false;

const PLATFORM_API_BASE_URL = import.meta.env.PLATFORM_API_BASE_URL || '';

const MAILCHIMP_FORM_ACTION =
  import.meta.env.MAILCHIMP_FORM_ACTION ||
  'https://talleywealth.us12.list-manage.com/subscribe/post';

const MAILCHIMP_FORM_U = import.meta.env.MAILCHIMP_FORM_U || '0737405481f8ec7296256fe17';
const MAILCHIMP_AUDIENCE_ID = import.meta.env.MAILCHIMP_AUDIENCE_ID || '013235d6d3';
const MAILCHIMP_GUIDE_TAG_ID = import.meta.env.MAILCHIMP_GUIDE_TAG_ID || '9169304';
const MAILCHIMP_FOOTER_TAG_ID = import.meta.env.MAILCHIMP_FOOTER_TAG_ID || '9169355';

function value(body: Record<string, unknown>, key: string): string {
  const raw = body[key];
  return typeof raw === 'string' ? raw.trim() : '';
}

function normalizeSource(source: string): string {
  const clean = source.trim().toLowerCase();
  if (clean === 'guide') return 'guide';
  if (clean === 'footer') return 'footer';
  if (clean === 'newsletter') return 'newsletter';
  return clean || 'website';
}

export const POST: StandaloneApiRoute = async ({ request }) => {
  const body = await readJson(request);
  if (!body) return json(400, { ok: false, error: 'invalid_json' });

  if (PLATFORM_API_BASE_URL) {
    const target = `${PLATFORM_API_BASE_URL.replace(/\/$/, '')}/api/newsletter/subscribe`;
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

  const email = value(body, 'email').toLowerCase();
  const firstName = value(body, 'first_name') || value(body, 'firstName');
  const lastName = value(body, 'last_name') || value(body, 'lastName');
  const source = normalizeSource(value(body, 'source'));

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { ok: false, error: 'Please enter a valid email address.' });
  }

  const form = new URLSearchParams({
    u: MAILCHIMP_FORM_U,
    id: MAILCHIMP_AUDIENCE_ID,
    MERGE0: email,
    MERGE1: firstName,
    MERGE2: lastName,
    MERGE5: source,
    b_name: '',
    b_email: '',
    mc_signupsource: source === 'guide' ? 'guide' : 'website',
  });

  if (source === 'guide') form.set('tags', MAILCHIMP_GUIDE_TAG_ID);
  if (source === 'footer' || source === 'newsletter') form.set('tags', MAILCHIMP_FOOTER_TAG_ID);

  const res = await fetch(MAILCHIMP_FORM_ACTION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  if (!res.ok) {
    return json(502, {
      ok: false,
      error: 'Mailchimp did not accept the signup. Please try again.',
    });
  }

  return json(200, {
    ok: true,
    message: source === 'guide'
      ? 'Your guide request was received.'
      : 'Your signup was received.',
  });
};
