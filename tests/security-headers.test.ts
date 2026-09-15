import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import IndexPage from '../src/pages/index.astro';

type HeaderRule = { source: string; headers: Array<{ key: string; value: string }> };
const rules = (JSON.parse(readFileSync('vercel.json', 'utf8')) as { headers: HeaderRule[] }).headers;
const header = (source: string, key: string) =>
  rules.find((rule) => rule.source === source)?.headers.find((h) => h.key === key)?.value;

describe('security headers (vercel.json)', () => {
  it('sends HSTS with includeSubDomains and preload on every path', () => {
    const hsts = header('/(.*)', 'Strict-Transport-Security')!;
    expect(hsts).toMatch(/max-age=(\d+)/);
    expect(Number(hsts.match(/max-age=(\d+)/)![1])).toBeGreaterThanOrEqual(31536000);
    expect(hsts).toContain('includeSubDomains');
    expect(hsts).toContain('preload');
  });

  it('applies a strict CSP to public pages and a scoped one to the CMS', () => {
    const publicCsp = header('/((?!keystatic|api/keystatic).*)', 'Content-Security-Policy')!;
    expect(publicCsp).toContain("script-src 'self';");
    expect(publicCsp).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(publicCsp).toContain("frame-ancestors 'none'");
    expect(publicCsp).toContain("object-src 'none'");
    expect(publicCsp).toContain('https://fonts.googleapis.com');
    expect(publicCsp).toContain('https://fonts.gstatic.com');

    const cmsCsp = header('/keystatic/:path*', 'Content-Security-Policy')!;
    expect(cmsCsp).toContain('https://api.github.com');
    expect(cmsCsp).toContain("frame-ancestors 'none'");
    expect(header('/keystatic/:path*', 'X-Robots-Tag')).toContain('noindex');
    expect(header('/api/keystatic/:path*', 'Cache-Control')).toBe('no-store');
  });
});

describe('rendered pages under the strict CSP', () => {
  it('contain no inline executable scripts or inline stylesheets', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(IndexPage, { request: new Request('https://harukakaya.dev/'), partial: false });

    const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)].filter(([, attrs]) => !/type="application\/ld\+json"/.test(attrs));
    expect(inlineScripts).toEqual([]);
    expect(html).not.toMatch(/<style[\s>]/);
    expect(html).toContain('src="/theme-init.js"');
  });
});
