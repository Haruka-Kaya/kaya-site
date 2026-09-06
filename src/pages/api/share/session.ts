import type { APIRoute } from 'astro';
import { COOKIE, json, newSession, passwordOK, sameOrigin, sessionOK } from '../../../lib/share';
const attempts = new Map<string, { count: number; until: number }>();
export const GET: APIRoute = ({ cookies }) => json({ authenticated: sessionOK(cookies.get(COOKIE)?.value) });
export const POST: APIRoute = async ({ request, cookies, clientAddress, url }) => {
  if (!sameOrigin(request)) return json({ error: 'このページから操作してください' }, 403);
  if (Number(request.headers.get('content-length')) > 2048) return json({ error: '入力が長すぎます' }, 413);
  const key = clientAddress || 'unknown'; const now = Date.now();
  if (attempts.size > 2000) for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
  const state = attempts.get(key);
  if (state && state.until > now && state.count >= 10) return json({ error: '少し待ってから試してください' }, 429);
  let body; try { const raw = await request.text(); if (raw.length > 2048) return json({ error: '入力が長すぎます' }, 413); body = JSON.parse(raw); } catch { return json({ error: '入力を確認してください' }, 400); }
  if (!passwordOK(body.password)) {
    attempts.set(key, { count: state && state.until > now ? state.count + 1 : 1, until: now + 60_000 });
    return json({ error: 'パスワードが違います' }, 401);
  }
  attempts.delete(key);
  cookies.set(COOKIE, newSession(), { path: '/', httpOnly: true, secure: url.protocol === 'https:', sameSite: 'strict', maxAge: 8 * 60 * 60 });
  return json({ authenticated: true });
};
export const DELETE: APIRoute = ({ request, cookies }) => {
  if (!sameOrigin(request)) return json({ error: 'このページから操作してください' }, 403);
  cookies.delete(COOKIE, { path: '/' }); return json({ authenticated: false });
};
