/**
 * Explicit opt-in smoke test against the local Docker backend, never VITE_API_URL.
 * Creates one synthetic contact and suggestion (no delete routes); removes only its own post.
 * Reads the local admin password without printing it. Run from the frontend repository.
 * @author oEnzoRibas
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const origin = 'http://localhost:18080';
const file = new URL('../../podiss-backend/.env.dev', import.meta.url);
const variables = Object.fromEntries((await readFile(file, 'utf8')).split(/\r?\n/)
  .filter(line => /^[A-Z_]+=/.test(line)).map(line => {
    const index = line.indexOf('=');
    return [line.slice(0, index), line.slice(index + 1).trim().replace(/^(['"])(.*)\1$/, '$2')];
  }));
assert.ok(variables.DEV_ADMIN_PASSWORD, 'DEV_ADMIN_PASSWORD ausente na configuração local.');
const marker = 'frontend-smoke-' + randomUUID();
let token;
let postId;
async function request(path, { method = 'GET', body, authorized = false } = {}) {
  const headers = { Origin: 'http://localhost:5173' };
  if (authorized) headers.Authorization = 'Bearer ' + token;
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  return fetch(origin + path, { method, headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000) });
}
try {
  let response = await request('/api/auth/login', { method: 'POST',
    body: { username: 'dev_admin', password: variables.DEV_ADMIN_PASSWORD } });
  assert.equal(response.status, 200, 'Login local deve funcionar.');
  token = (await response.json()).token;
  assert.ok(token);
  response = await request('/contatos?page=0&size=1');
  assert.equal(response.status, 401);
  response = await request('/contatos', { method: 'POST',
    body: { nome: marker, email: 'frontend-smoke@example.com', assunto: marker, mensagem: 'Teste local de integração.' } });
  assert.equal(response.status, 201);
  assert.ok((await response.json()).id);
  response = await request('/sugestoes', { method: 'POST',
    body: { nome: marker, email: 'frontend-smoke@example.com', tema: marker } });
  assert.equal(response.status, 201);
  response = await request('/contatos?page=0&size=1&order=desc', { authorized: true });
  assert.equal(response.status, 200);
  assert.equal((await response.json())[0].assunto, marker);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  assert.match(response.headers.get('access-control-expose-headers') ?? '', /X-Total-Pages/i);
  response = await request('/sugestoes?page=0&size=1&order=desc', { authorized: true });
  assert.equal(response.status, 200);
  assert.equal((await response.json())[0].tema, marker);

  const form = new FormData();
  form.append('title', marker); form.append('description', 'Teste local');
  form.append('tags', 'local'); form.append('tags', 'integração');
  response = await request('/posts', { method: 'POST', body: form, authorized: true });
  assert.equal(response.status, 201);
  const post = await response.json(); postId = post.id;
  assert.equal(post.hasImage, false); assert.equal(post.tags, 'local,integração');
  response = await request('/posts/' + postId, { method: 'DELETE' });
  assert.equal(response.status, 401, 'Anonymous clients must not delete posts.');
  response = await request('/posts/' + postId);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).title, marker);
  response = await request('/posts/' + postId, { method: 'PUT', authorized: true,
    body: { title: marker + '-updated', tags: [] } });
  assert.equal(response.status, 200); assert.equal((await response.json()).tags, '');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
  const image = new FormData(); image.append('image', new Blob([png], { type: 'image/png' }), 'pixel.png');
  response = await request('/posts/' + postId + '/image', { method: 'PUT', body: image, authorized: true });
  assert.equal(response.status, 200); assert.equal((await response.json()).hasImage, true);
  response = await request('/posts/image/' + postId);
  assert.equal(response.status, 200); assert.equal(response.headers.get('content-type'), 'image/png');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), png);
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  const replacement = new FormData();
  replacement.append('image', new Blob([gif], { type: 'image/gif' }), 'replacement.gif');
  response = await request('/posts/' + postId + '/image', { method: 'PUT', body: replacement, authorized: true });
  assert.equal(response.status, 200);
  response = await request('/posts/image/' + postId + '?v=' + Date.now());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/gif');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), gif, 'Replacement must return new bytes, not the previous image.');
  response = await request('/posts/' + postId + '/image', { method: 'DELETE', authorized: true });
  assert.equal(response.status, 204);
  response = await request('/posts/image/' + postId); assert.equal(response.status, 404);
  response = await request('/posts?page=0&size=1&order=desc');
  assert.equal(response.status, 200); assert.ok(response.headers.get('x-total-pages'));
  response = await request('/episodes?page=0&size=1&order=desc'); assert.equal(response.status, 200);
  response = await request('/episodes/invalid'); assert.equal(response.status, 400);
  console.log('PASS: login, authorization, contact, suggestion, CORS, pagination, posts, image lifecycle and episode validation.');
  console.log('Synthetic contact/suggestion retained locally: ' + marker);
} finally {
  if (postId && token) {
    const response = await request('/posts/' + postId, { method: 'DELETE', authorized: true });
    assert.equal(response.status, 204, 'Cleanup of the smoke-test post failed.');
    console.log('Smoke-test post removed; existing records untouched.');
  }
}
