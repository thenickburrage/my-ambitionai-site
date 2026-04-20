import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

interface LeadMagnetPayload {
  first_name?: string;
  email?: string;
  consent?: boolean;
  tag?: string;
  turnstile_token?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/lead-magnet
 *
 * Validates the submission, verifies Turnstile, pushes the contact into
 * Systeme.io with the requested tag, and returns the PDF download URL.
 *
 * Never echoes a raw Systeme.io error back to the client. If Systeme.io
 * fails we still return the download URL so a backend hiccup does not
 * penalise the visitor.
 */
export const POST: APIRoute = async ({ request }) => {
  const envAny = env as any;

  let body: LeadMagnetPayload;
  try {
    body = (await request.json()) as LeadMagnetPayload;
  } catch {
    return json({ success: false, error: 'Invalid request body.' }, 400);
  }

  const firstName = (body.first_name ?? '').trim();
  const email = (body.email ?? '').trim().toLowerCase();
  const consent = body.consent === true;
  const tag = (body.tag ?? 'ai-briefing-downloaded').trim();
  const token = (body.turnstile_token ?? '').trim();

  if (!firstName || firstName.length > 80) {
    return json({ success: false, error: 'Please enter your first name.' }, 400);
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return json({ success: false, error: 'Please enter a valid email address.' }, 400);
  }
  if (!consent) {
    return json({ success: false, error: 'Consent is required.' }, 400);
  }
  if (!token) {
    return json({ success: false, error: "Couldn't verify you're human, please try again." }, 400);
  }

  // 1. Verify Turnstile
  const turnstileOk = await verifyTurnstile(token, envAny.TURNSTILE_SECRET_KEY, request);
  if (!turnstileOk) {
    return json({ success: false, error: "Couldn't verify you're human, please try again." }, 400);
  }

  // 2. Push contact to Systeme.io + tag. Failures are logged but do not
  // block the visitor from getting the PDF.
  try {
    await upsertSystemeContact({ email, firstName, tag, apiKey: envAny.SYSTEME_API_KEY });
  } catch (err) {
    // Deliberately avoid logging the email address to Cloudflare logs.
    console.warn('Lead magnet: Systeme.io upsert failed.', {
      message: (err as Error).message,
    });
  }

  const downloadUrl = '/downloads/19_trust_signals_briefing_v4.pdf';
  return json({ success: true, downloadUrl });
};

// ---------------------------------------------------------------------------

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

async function verifyTurnstile(
  token: string,
  secret: string | undefined,
  request: Request,
): Promise<boolean> {
  if (!secret) {
    // Fail closed: if the secret is missing, treat as failure rather than
    // accepting every submission.
    console.warn('Lead magnet: TURNSTILE_SECRET_KEY missing.');
    return false;
  }
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for') ??
    '';

  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: form },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.warn('Lead magnet: Turnstile verify failed.', {
      message: (err as Error).message,
    });
    return false;
  }
}

async function upsertSystemeContact(opts: {
  email: string;
  firstName: string;
  tag: string;
  apiKey: string | undefined;
}): Promise<void> {
  const { email, firstName, tag, apiKey } = opts;
  if (!apiKey) throw new Error('SYSTEME_API_KEY missing');

  const headers = {
    'content-type': 'application/json',
    'accept': 'application/json',
    'X-API-Key': apiKey,
  };

  // 1. Try to create the contact. If they already exist Systeme returns a
  // 4xx which we treat as "fine, just tag them".
  let contactId: number | null = null;
  const createRes = await fetch('https://api.systeme.io/api/contacts', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      fields: [{ slug: 'first_name', value: firstName }],
    }),
  });

  if (createRes.ok) {
    const data = (await createRes.json()) as { id?: number };
    if (typeof data.id === 'number') contactId = data.id;
  }

  // 2. If creation failed (likely because the contact already exists), look
  // them up by email so we can tag the existing record.
  if (contactId === null) {
    const lookupRes = await fetch(
      `https://api.systeme.io/api/contacts?email=${encodeURIComponent(email)}`,
      { method: 'GET', headers },
    );
    if (lookupRes.ok) {
      const data = (await lookupRes.json()) as { items?: Array<{ id: number }> };
      if (data.items && data.items.length > 0) contactId = data.items[0]!.id;
    }
  }

  if (contactId === null) {
    throw new Error('Could not resolve Systeme.io contact id');
  }

  // 3. Assign the tag. Systeme.io's tag API expects a tag id, so we first
  // resolve the tag by name, then attach it to the contact.
  const tagId = await resolveTagId(tag, headers);
  if (tagId === null) {
    throw new Error(`Could not resolve Systeme.io tag id for "${tag}"`);
  }

  const tagRes = await fetch(
    `https://api.systeme.io/api/contacts/${contactId}/tags`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ tagId }),
    },
  );
  if (!tagRes.ok && tagRes.status !== 409 /* already tagged */) {
    const detail = await tagRes.text().catch(() => '');
    throw new Error(`Systeme.io tag assignment failed (${tagRes.status}): ${detail.slice(0, 200)}`);
  }
}

async function resolveTagId(
  tagName: string,
  headers: Record<string, string>,
): Promise<number | null> {
  // Systeme.io tag listing. Page through results looking for a name match.
  let url: string | null = 'https://api.systeme.io/api/tags';
  while (url) {
    const res: Response = await fetch(url, { headers });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      items?: Array<{ id: number; name: string }>;
      nextPageUrl?: string | null;
    };
    const found = data.items?.find((t) => t.name === tagName);
    if (found) return found.id;
    url = data.nextPageUrl ?? null;
  }
  return null;
}
