import type { APIRoute } from 'astro';
import { handleUpload } from '@vercel/blob/client';
import { COOKIE, HEADER_SIZE, MAX_SIZE, SLOT, json, sameOrigin, sessionOK, secret } from '../../../lib/share';
export const POST: APIRoute = async ({ request, cookies }) => {
  // Completion callbacks are unnecessary: the file and its name are stored atomically in one blob.
  if (!sessionOK(cookies.get(COOKIE)?.value)) return json({ error: 'パスワードを入力してください' }, 401);
  if (!sameOrigin(request)) return json({ error: 'このページから操作してください' }, 403);
  try {
    const raw = await request.text(); if (raw.length > 8192) return json({ error: '入力が長すぎます' }, 413);
    const body = JSON.parse(raw);
    if (body.type !== 'blob.generate-client-token') return json({ error: '未対応の操作です' }, 400);
    const result = await handleUpload({ token: secret('BLOB_READ_WRITE_TOKEN'), request, body, onBeforeGenerateToken: async pathname => {
      if (pathname !== SLOT) throw new Error('invalid slot');
      return { maximumSizeInBytes: MAX_SIZE + HEADER_SIZE, allowedContentTypes: ['application/octet-stream'], addRandomSuffix: false, allowOverwrite: false, validUntil: Date.now() + 10 * 60 * 1000, cacheControlMaxAge: 60 };
    } });
    return json(result);
  } catch { return json({ error: 'アップロードの準備に失敗しました。再ログインして試してください' }, 400); }
};
