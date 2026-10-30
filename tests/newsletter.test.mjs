import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadTypeScript(path, bindings = {}) {
  const module = {exports: {}};
  const source = fs.readFileSync(path, 'utf8');
  const code = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(code, {module, exports: module.exports, ...bindings}, {filename: path});
  return module.exports;
}

test('newsletter response states and analytics keep request separate from confirmation', () => {
  const {resolveNewsletterResponse} = loadTypeScript('src/lib/newsletter-response.ts');
  assert.deepEqual({...resolveNewsletterResponse(202, {status: 'pending_confirmation'})}, {state: 'pending', event: 'newsletter_signup_requested'});
  assert.deepEqual({...resolveNewsletterResponse(200, {status: 'confirmed'})}, {state: 'success', event: 'newsletter_signup_confirmed'});
  assert.deepEqual({...resolveNewsletterResponse(409, {code: 'already_registered'})}, {state: 'duplicate'});
  assert.deepEqual({...resolveNewsletterResponse(503, {code: 'not_configured'})}, {state: 'unavailable'});
  assert.deepEqual({...resolveNewsletterResponse(502, {code: 'provider_unavailable'})}, {state: 'error'});
  assert.deepEqual({...resolveNewsletterResponse(200, {status: 'pending_confirmation'})}, {state: 'error'});
});

test('newsletter submission lock rejects duplicate submits and releases for retry', () => {
  const {beginNewsletterSubmission} = loadTypeScript('src/lib/newsletter-response.ts');
  const lock = {current: false};
  assert.equal(beginNewsletterSubmission(lock), true);
  assert.equal(beginNewsletterSubmission(lock), false);
  lock.current = false;
  assert.equal(beginNewsletterSubmission(lock), true);
});

function loadNewsletterApi(fetchImpl) {
  return loadTypeScript('functions/api/newsletter.ts', {
    fetch: fetchImpl,
    Response,
    URL,
    TextDecoder,
    Uint8Array,
    AbortSignal,
  });
}

function postRequest(payload, headers = {}) {
  return new Request('https://site.example/api/newsletter', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Origin: 'https://site.example', ...headers},
    body: JSON.stringify(payload),
  });
}

test('newsletter API only creates unactivated subscribers and requires explicit consent', async () => {
  let providerCalls = 0;
  let providerBody;
  const api = loadNewsletterApi(async (url, options) => {
    providerCalls++;
    assert.equal(url, 'https://api.buttondown.com/v1/subscribers');
    providerBody = JSON.parse(options.body);
    return Response.json({type: 'unactivated', email_address: providerBody.email_address}, {status: 201});
  });
  const invalid = await api.onRequestPost({request: postRequest({email: 'reader@example.com'}), env: {BUTTONDOWN_API_KEY: 'mock-key'}});
  assert.equal(invalid.status, 400);
  assert.equal(providerCalls, 0);

  const accepted = await api.onRequestPost({request: postRequest({email: 'reader@example.com', consent: true}), env: {BUTTONDOWN_API_KEY: 'mock-key'}});
  assert.equal(accepted.status, 202);
  assert.deepEqual(await accepted.json(), {status: 'pending_confirmation'});
  assert.equal(providerCalls, 1);
  assert.equal(providerBody.type, 'unactivated');
  assert.equal(providerBody.email_address, 'reader@example.com');
  assert.equal(providerBody.metadata.consent.newsletter, true);
});

test('newsletter API distinguishes provider duplicate from rejection and never calls a real provider in tests', async () => {
  for (const [providerStatus, expectedStatus, expectedCode] of [[409, 409, 'already_registered'], [400, 502, 'provider_rejected_submission'], [422, 502, 'provider_rejected_submission']]) {
    let providerCalls = 0;
    const api = loadNewsletterApi(async () => {
      providerCalls++;
      return new Response('', {status: providerStatus});
    });
    const response = await api.onRequestPost({request: postRequest({email: 'reader@example.com', consent: true}), env: {BUTTONDOWN_API_KEY: 'mock-key'}});
    assert.equal(providerCalls, 1);
    assert.equal(response.status, expectedStatus);
    assert.deepEqual(await response.json(), {code: expectedCode});
  }
});

test('newsletter API reports an unavailable configuration without provider requests', async () => {
  let providerCalls = 0;
  const api = loadNewsletterApi(async () => {providerCalls++; throw new Error('unexpected network');});
  const status = await api.onRequestGet({env: {}});
  assert.deepEqual(await status.json(), {available: false});
  const response = await api.onRequestPost({request: postRequest({email: 'reader@example.com', consent: true}), env: {}});
  assert.equal(response.status, 503);
  assert.equal(providerCalls, 0);
});
