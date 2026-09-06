import type { APIRoute } from 'astro';
import { del, get, head } from '@vercel/blob';
import { COOKIE, SLOT, TTL, json, privateHeaders, readEnvelope, sameOrigin, sessionOK, secret } from '../../../lib/share';
export const GET: APIRoute = async ({ cookies, url }) => {
  if (!sessionOK(cookies.get(COOKIE)?.value)) return json({ error: 'パスワードを入力してください' }, 401);
  try {
    const result = await get(SLOT, { access: 'private', useCache: false, token: secret('BLOB_READ_WRITE_TOKEN') });
    if (!result || result.statusCode !== 200) return json({ file: null });
    const expiresAt = result.blob.uploadedAt.getTime() + TTL; const expired = expiresAt <= Date.now();
    const metadata = await head(SLOT, { token: secret('BLOB_READ_WRITE_TOKEN') });
    if (metadata.etag.replace(/^W\//, '') !== result.blob.etag.replace(/^W\//, '')) { await result.stream.cancel(); return json({ error: 'ファイルが更新されました。再読み込みしてください' }, 409); }
    const { name, size, body } = await readEnvelope(result.stream, metadata.size);
    if (!url.searchParams.has('download')) { await body.cancel(); return json({ file: { name, size, expiresAt, expired } }); }
    if (expired) { await body.cancel(); return json({ error: 'ダウンロード期限が切れています' }, 410); }
    return new Response(body, { headers: { ...privateHeaders, 'Content-Type': 'application/octet-stream', 'Content-Length': String(size), 'Content-Disposition': `attachment; filename="download"; filename*=UTF-8''${encodeURIComponent(name).replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16))}`, 'Content-Security-Policy': "default-src 'none'; sandbox" } });
  } catch (error) { console.error('share read failed', error instanceof Error ? error.name + ': ' + error.message : 'unknown'); return json({ error: 'ファイルを読み込めませんでした。再読み込みするか、削除してアップロードし直してください' }, 502); }
};
export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!sessionOK(cookies.get(COOKIE)?.value)) return json({ error: 'パスワードを入力してください' }, 401);
  if (!sameOrigin(request)) return json({ error: 'このページから操作してください' }, 403);
  try { await del(SLOT, { token: secret('BLOB_READ_WRITE_TOKEN') }); return json({ file: null }); } catch { return json({ error: '削除できませんでした。もう一度試してください' }, 502); }
};
