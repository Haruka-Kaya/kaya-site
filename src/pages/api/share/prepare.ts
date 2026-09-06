import type { APIRoute } from 'astro';
import { BlobNotFoundError, head, issueSignedToken, presignUrl } from '@vercel/blob';
import { bearerOK, HEADER_SIZE, MAX_SIZE, SLOT, json, safeName, secret } from '../../../lib/share';
export const POST: APIRoute = async ({ request }) => {
  if (!bearerOK(request)) return json({ error: 'Bearer認証が必要です', code: 'UNAUTHORIZED' }, 401);
  let name: string, size: number;
  try {
    const raw = await request.text(); if (raw.length > 4096) throw new Error();
    const input = JSON.parse(raw); name = safeName(input.name); size = input.size;
    if (!Number.isSafeInteger(size) || size < 1 || size > MAX_SIZE) throw new Error();
  } catch { return json({ error: 'name と size（1〜104857600バイト）を指定してください', code: 'INVALID_FILE' }, 400); }
  const token = secret('BLOB_READ_WRITE_TOKEN');
  try {
    try { await head(SLOT, { token }); return json({ error: '保存枠が使用中です。削除は明示的に行ってください', code: 'SLOT_OCCUPIED' }, 409); }
    catch (error) { if (!(error instanceof BlobNotFoundError)) throw error; }
    const validUntil = Date.now() + 5 * 60 * 1000;
    const credentials = await issueSignedToken({ token, pathname: SLOT, operations: ['put'], validUntil, maximumSizeInBytes: size + HEADER_SIZE, allowedContentTypes: ['application/octet-stream'] });
    const { presignedUrl } = await presignUrl(credentials, { operation: 'put', pathname: SLOT, access: 'private', validUntil, maximumSizeInBytes: size + HEADER_SIZE, allowedContentTypes: ['application/octet-stream'], allowOverwrite: false, addRandomSuffix: false, cacheControlMaxAge: 60 });
    const prefix = Buffer.alloc(HEADER_SIZE, 32); prefix.write(JSON.stringify({ version: 1, name, size }));
    return json({ uploadUrl: presignedUrl, method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, prefixBase64: prefix.toString('base64'), contentLength: size + HEADER_SIZE, expiresAt: validUntil, complete: '/api/share/file', instructions: 'Decode prefixBase64, prepend these bytes to the original file, and PUT that body to uploadUrl. Do not send the shared password to uploadUrl. Then GET complete to verify.' });
  } catch { return json({ error: 'アップロード先を準備できませんでした', code: 'STORAGE_UNAVAILABLE' }, 502); }
};
