type NewsletterEnvironment = {
  BUTTONDOWN_API_KEY?: string;
};

type PagesContext = {
  request: Request;
  env: NewsletterEnvironment;
};

const JSON_HEADERS = {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'};

function reply(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {status, headers: JSON_HEADERS});
}

async function readBoundedBody(request: Request, limit: number) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new RangeError('request_too_large');
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

export function onRequestGet({env}: PagesContext) {
  return reply(200, {available: Boolean(env.BUTTONDOWN_API_KEY?.trim())});
}

export async function onRequestPost({request, env}: PagesContext) {
  const apiKey = env.BUTTONDOWN_API_KEY?.trim();
  if (!apiKey) return reply(503, {code: 'not_configured'});

  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');
  const fetchSite = request.headers.get('Sec-Fetch-Site');
  if (origin !== requestUrl.origin || (fetchSite && fetchSite !== 'same-origin')) {
    return reply(403, {code: 'same_origin_required'});
  }

  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
    return reply(415, {code: 'json_required'});
  }
  const contentLength = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(contentLength) && contentLength > 4096) return reply(413, {code: 'request_too_large'});

  let data: unknown;
  try {
    data = JSON.parse(await readBoundedBody(request, 4096));
  } catch (error) {
    return reply(error instanceof RangeError ? 413 : 400, {code: error instanceof RangeError ? 'request_too_large' : 'invalid_json'});
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return reply(400, {code: 'invalid_payload'});
  const submission = data as {email?: unknown; consent?: unknown; website?: unknown};

  const email = typeof submission.email === 'string' ? submission.email.trim().toLowerCase() : '';
  if (typeof submission.website === 'string' && submission.website.trim()) return reply(400, {code: 'invalid_submission'});
  if (submission.consent !== true) return reply(400, {code: 'consent_required'});
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(400, {code: 'invalid_email'});

  const acceptedAt = new Date().toISOString();
  const clientIp = request.headers.get('CF-Connecting-IP');
  const subscriber = {
    email_address: email,
    type: 'unactivated',
    notes: `Consentimento expresso para avisos de novos artigos de Pausa do café em ${acceptedAt}.`,
    metadata: {consent: {newsletter: true, accepted_at: acceptedAt, source: 'Pausa do café'}},
    ...(clientIp && clientIp.length <= 45 ? {ip_address: clientIp} : {}),
  };

  try {
    const response = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: {'Authorization': `Token ${apiKey}`, 'Content-Type': 'application/json'},
      body: JSON.stringify(subscriber),
      signal: AbortSignal.timeout(10000),
    });

    if (response.status === 201) {
      const created: unknown = await response.json().catch(() => null);
      if (typeof created === 'object' && created !== null && 'type' in created && 'email_address' in created
        && created.type === 'unactivated' && typeof created.email_address === 'string'
        && created.email_address.toLowerCase() === email) {
        return reply(202, {status: 'pending_confirmation'});
      }
      return reply(502, {code: 'provider_unconfirmed'});
    }
    if (response.status === 409) return reply(409, {code: 'already_registered'});
    if (response.status === 429) return reply(429, {code: 'rate_limited'});
    if (response.status === 401 || response.status === 403) return reply(503, {code: 'provider_configuration_error'});
    if (response.status === 400 || response.status === 422) return reply(502, {code: 'provider_rejected_submission'});
    return reply(502, {code: 'provider_unavailable'});
  } catch {
    return reply(502, {code: 'provider_unavailable'});
  }
}
