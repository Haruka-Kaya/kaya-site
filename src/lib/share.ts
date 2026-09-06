import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
export const SLOT = 'temporary-share/current';
export const HEADER_SIZE = 4096;
export const MAX_SIZE = 100 * 1024 * 1024;
export const TTL = 24 * 60 * 60 * 1000;
export const COOKIE = 'share_session';
export const privateHeaders = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' };
export function secret(name: string) { return process.env[name] || import.meta.env[name] || ''; }
function equal(a: string, b: string) { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
export function passwordOK(value: unknown) {
  const expected = secret('SHARE_PASSWORD_HASH');
  return typeof value === 'string' && value.length <= 256 && expected.length === 64 && equal(createHash('sha256').update(value).digest('hex'), expected);
}
function signature(body: string) { return createHmac('sha256', secret('SHARE_SESSION_SECRET')).update(body).digest('base64url'); }
export function newSession(now = Date.now()) {
  if (!secret('SHARE_SESSION_SECRET')) throw new Error('共有設定がありません');
  const body = `${now + 8 * 60 * 60 * 1000}.${randomBytes(16).toString('hex')}`;
  return `${body}.${signature(body)}`;
}
export function sessionOK(value = '', now = Date.now()) {
  if (!secret('SHARE_SESSION_SECRET') || value.length > 200) return false;
  const [expiry, nonce, mac, extra] = value.split('.');
  return !extra && /^\d+$/.test(expiry || '') && /^[a-f0-9]{32}$/.test(nonce || '') && Number(expiry) > now && Number(expiry) <= now + 8 * 60 * 60 * 1000 && equal(signature(`${expiry}.${nonce}`), mac || '');
}
export function sameOrigin(request: Request) { return request.headers.get('origin') === new URL(request.url).origin; }
export function safeName(name: unknown) {
  if (typeof name !== 'string') throw new Error('ファイル名が不正です');
  const clean = name.replace(/[\x00-\x1f\x7f/\\]/g, '_').trim();
  if (!clean || new TextEncoder().encode(clean).length > 768) throw new Error('ファイル名が長すぎます');
  return clean;
}
export async function readEnvelope(stream: ReadableStream<Uint8Array>, totalSize: number) {
  const reader = stream.getReader(); const header = new Uint8Array(HEADER_SIZE); let offset = 0; let remainder = new Uint8Array(0);
  try {
    while (offset < HEADER_SIZE) {
      const { value, done } = await reader.read(); if (done) throw new Error('ファイルが不完全です');
      const count = Math.min(value.length, HEADER_SIZE - offset); header.set(value.subarray(0, count), offset); offset += count;
      if (count < value.length) remainder = value.subarray(count);
    }
    const meta = JSON.parse(new TextDecoder().decode(header).trim());
    if (meta.version !== 1 || !Number.isSafeInteger(meta.size) || meta.size < 1 || meta.size > MAX_SIZE || totalSize !== meta.size + HEADER_SIZE) throw new Error('ファイル形式が不正です');
    const name = safeName(meta.name);
    const body = new ReadableStream<Uint8Array>({
      start(controller) { if (remainder.length) controller.enqueue(remainder); },
      async pull(controller) { try { const { value, done } = await reader.read(); if (done) { controller.close(); reader.releaseLock(); } else controller.enqueue(value); } catch (error) { controller.error(error); } },
      cancel(reason) { return reader.cancel(reason); },
    });
    return { name, size: meta.size as number, body };
  } catch (error) { await reader.cancel().catch(() => {}); throw error; }
}
export function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { ...privateHeaders, 'Content-Type': 'application/json' } }); }

// Explicit bearer credentials are never sent automatically by browsers. Cookie mutations still require Origin.
export function bearerOK(request: Request) {
  const header = request.headers.get('authorization');
  return !!header?.startsWith('Bearer ') && passwordOK(header.slice(7));
}
export function authorized(request: Request, cookie?: string) {
  return request.headers.has('authorization') ? bearerOK(request) : sessionOK(cookie);
}
export function mutationAllowed(request: Request) { return bearerOK(request) || sameOrigin(request); }

// Read-only capabilities are bound to one object version and never authorize mutations.
export function newReadToken(etag: string, expiresAt: number) {
  const version = createHash('sha256').update(etag.replace(/^W\//, '')).digest('hex');
  const body = `read.${expiresAt}.${version}`;
  if (!secret('SHARE_SESSION_SECRET')) throw new Error('共有設定がありません');
  return `${body}.${signature(body)}`;
}
export function readTokenOK(token: string, etag?: string, now = Date.now()) {
  if (!secret('SHARE_SESSION_SECRET') || token.length > 200) return false;
  const [scope, expiry, version, mac, extra] = token.split('.');
  if (extra || scope !== 'read' || !/^\d+$/.test(expiry || '') || !/^[a-f0-9]{64}$/.test(version || '') || Number(expiry) <= now || Number(expiry) > now + TTL) return false;
  if (!equal(signature(`read.${expiry}.${version}`), mac || '')) return false;
  return etag === undefined || equal(createHash('sha256').update(etag.replace(/^W\//, '')).digest('hex'), version);
}
