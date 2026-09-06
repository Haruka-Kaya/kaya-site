import type { APIRoute } from 'astro';
import { head, BlobNotFoundError } from '@vercel/blob';
import { authorized, COOKIE, mutationAllowed, SLOT, secret, TTL, newReadToken, json } from '../../../lib/share';
export const POST: APIRoute = async ({ request, cookies, url }) => {
  if (!authorized(request, cookies.get(COOKIE)?.value)) return json({ error: 'ログインしてください' }, 401);
  if (!mutationAllowed(request)) return json({ error: 'このページから操作してください' }, 403);
  try {
    const file = await head(SLOT, { token: secret('BLOB_READ_WRITE_TOKEN') });
    const expiresAt = file.uploadedAt.getTime() + TTL;
    if (expiresAt <= Date.now()) return json({ error: '期限が切れています' }, 410);
    const link = new URL('/share/read', url.origin);
    link.searchParams.set('key', newReadToken(file.etag, expiresAt));
    return json({ url: link.href, expiresAt });
  } catch (error) { return json({ error: error instanceof BlobNotFoundError ? '先にファイルをアップロードしてください' : 'リンクを作れませんでした' }, error instanceof BlobNotFoundError ? 404 : 502); }
};
