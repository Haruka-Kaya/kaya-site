import { beforeEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { HEADER_SIZE, MAX_SIZE, newSession, passwordOK, readEnvelope, sameOrigin, sessionOK } from '../../src/lib/share';
beforeEach(() => { process.env.SHARE_SESSION_SECRET = 'unit-test-secret-not-for-production'; process.env.SHARE_PASSWORD_HASH = createHash('sha256').update('unit-test-password').digest('hex'); });
describe('temporary sharing security', () => {
  it('rejects missing, wrong and non-string passwords', () => { expect(passwordOK('unit-test-password')).toBe(true); for (const value of ['', 'wrong', {}, undefined]) expect(passwordOK(value)).toBe(false); });
  it('rejects tampered, expired and rotated sessions', () => { const now = Date.now(); const s = newSession(now); expect(sessionOK(s, now)).toBe(true); expect(sessionOK(s + 'x', now)).toBe(false); expect(sessionOK(s, now + 8*3600_000)).toBe(false); process.env.SHARE_SESSION_SECRET = 'rotated'; expect(sessionOK(s, now)).toBe(false); });
  it('requires exact origin for mutations', () => { expect(sameOrigin(new Request('https://harukakaya.dev/api/share/file', {headers:{origin:'https://harukakaya.dev'}}))).toBe(true); for (const origin of ['https://evil.example', 'null', 'https://harukakaya.dev.evil.example']) expect(sameOrigin(new Request('https://harukakaya.dev/api/share/file', {headers:{origin}}))).toBe(false); });
  it('preserves binary bytes and Japanese filenames across stream boundaries', async () => {
    const bytes = new Uint8Array([0,255,10,200]); const header = new Uint8Array(HEADER_SIZE).fill(32); header.set(new TextEncoder().encode(JSON.stringify({version:1,name:'実寸.3mf',size:bytes.length})));
    const full = new Uint8Array(HEADER_SIZE+bytes.length); full.set(header); full.set(bytes,HEADER_SIZE);
    const stream = new ReadableStream<Uint8Array>({start(c){for(let i=0;i<full.length;i+=11)c.enqueue(full.slice(i,i+11));c.close();}});
    const r=await readEnvelope(stream,full.length); expect(r.name).toBe('実寸.3mf'); expect(new Uint8Array(await new Response(r.body).arrayBuffer())).toEqual(bytes);
  });
  it('rejects malformed and oversized envelopes', async () => {
    const header=new Uint8Array(HEADER_SIZE).fill(32);header.set(new TextEncoder().encode(JSON.stringify({version:1,name:'x',size:MAX_SIZE+1})));
    await expect(readEnvelope(new Blob([header]).stream(),HEADER_SIZE)).rejects.toThrow();
    await expect(readEnvelope(new Blob(['short']).stream(),5)).rejects.toThrow();
  });
});
