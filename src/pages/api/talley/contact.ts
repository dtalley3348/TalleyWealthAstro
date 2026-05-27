import { json, readJson, type StandaloneApiRoute } from '../../../lib/platform-api';

export const prerender = false;

const PLATFORM_API_BASE_URL = import.meta.env.PLATFORM_API_BASE_URL || '';
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || '';
const CONTACT_TO_EMAIL = import.meta.env.CONTACT_TO_EMAIL || 'hello@talleywealth.com';
const CONTACT_FROM_EMAIL = import.meta.env.CONTACT_FROM_EMAIL || '';
const CONTACT_BCC_EMAIL = import.meta.env.CONTACT_BCC_EMAIL || '';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  topic: string;
};

function asText(value: unknown, maxLength = 1000): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parseContactPayload(body: Record<string, unknown>): ContactPayload {
  return {
    firstName: asText(body.firstName, 100),
    lastName: asText(body.lastName, 100),
    email: asText(body.email, 254).toLowerCase(),
    phone: asText(body.phone, 50),
    message: asText(body.message, 3000),
    source: asText(body.source, 100) || 'contact',
    topic: asText(body.topic, 200),
  };
}

function buildEmail(payload: ContactPayload) {
  const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(' ');
  const subject = `New Talley Wealth website message from ${fullName}`;
  const submittedAt = new Date().toISOString();
  const rows = [
    ['Name', fullName],
    ['Email', payload.email],
    ['Phone', payload.phone || 'Not provided'],
    ['Source', payload.source],
    ['Topic', payload.topic || 'Not provided'],
    ['Submitted', submittedAt],
    ['Message', payload.message || 'No message provided'],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n\n');
  const html = `
    <div style="font-family: Arial, sans-serif; color: #182635; line-height: 1.5;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">New website message</h1>
      ${rows.map(([label, value]) => `
        <p style="margin: 0 0 14px;">
          <strong>${escapeHtml(label)}:</strong><br />
          ${escapeHtml(value).replaceAll('\n', '<br />')}
        </p>
      `).join('')}
    </div>
  `;

  return { subject, text, html };
}

async function proxyToPlatform(payload: ContactPayload): Promise<Response> {
  const target = `${PLATFORM_API_BASE_URL.replace(/\/$/, '')}/api/talley/contact`;
  const res = await fetch(target, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  });
}

async function sendContactEmail(payload: ContactPayload): Promise<Response> {
  if (!CONTACT_FROM_EMAIL) {
    return json(500, { ok: false, error: 'missing_contact_from_email' });
  }

  const { subject, text, html } = buildEmail(payload);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      ...(CONTACT_BCC_EMAIL ? { bcc: [CONTACT_BCC_EMAIL] } : {}),
      reply_to: payload.email,
      subject,
      text,
      html,
      tags: [
        { name: 'source', value: payload.source.replace(/[^a-zA-Z0-9_-]/g, '_') || 'contact' },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('Failed to send Talley contact email', detail);
    return json(502, { ok: false, error: 'email_send_failed' });
  }

  return json(200, { ok: true });
}

export const POST: StandaloneApiRoute = async ({ request }) => {
  const body = await readJson(request);
  if (!body) return json(400, { ok: false, error: 'invalid_json' });

  const payload = parseContactPayload(body);
  if (!payload.firstName || !emailRe.test(payload.email)) {
    return json(400, { ok: false, error: 'invalid_contact_submission' });
  }

  if (PLATFORM_API_BASE_URL) return proxyToPlatform(payload);
  if (RESEND_API_KEY) return sendContactEmail(payload);

  return json(200, {
    ok: true,
    localOnly: true,
    id: 'local-talley-contact',
    message: 'Local Talley contact submission accepted.',
  });
};
