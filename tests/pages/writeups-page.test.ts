import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import WriteupsPage from '../../src/pages/writeups/index.astro';
import WriteupPage, { getStaticPaths } from '../../src/pages/writeups/[slug].astro';
import EnWriteupPage, { getStaticPaths as getEnStaticPaths } from '../../src/pages/[lang]/writeups/[slug].astro';

describe('writeups', () => {
  it('generates one path per published post in each locale', async () => {
    const ja = await getStaticPaths();
    const en = await getEnStaticPaths();

    expect(ja.length).toBeGreaterThan(0);
    expect(ja.map((p) => p.params.slug).sort()).toEqual(en.map((p) => p.params.slug).sort());
    expect(en.every((p) => p.params.lang === 'en')).toBe(true);
  });

  it('renders the list page sorted newest first', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(WriteupsPage, {
      request: new Request('https://harukakaya.dev/writeups'),
      partial: false,
    });

    expect(html).toContain('<title>Writeups | 賀屋 悠</title>');
    const dates = [...html.matchAll(/datetime="(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
    expect(dates.length).toBeGreaterThan(1);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(html).toContain('hreflang="en" href="https://harukakaya.dev/en/writeups"');
  });

  it('renders a post with markdown body, table of contents, and progress bar', async () => {
    const paths = await getStaticPaths();
    const target = paths.find((p) => p.params.slug === 'how-i-write-hackerone-reports')!;
    const container = await AstroContainer.create();
    const html = await container.renderToString(WriteupPage, {
      params: target.params,
      props: target.props,
      request: new Request('https://harukakaya.dev/writeups/how-i-write-hackerone-reports'),
      partial: false,
    });

    expect(html).toContain('<html lang="ja"');
    expect(html).toContain('HackerOneで報告するときに気をつけていること');
    expect(html).toContain('<h2 id="');
    expect(html).toContain('class="toc"');
    expect(html).toContain('data-progress');
    expect(html).toContain('"@type":"BlogPosting"');
    expect(html).toContain('hreflang="en" href="https://harukakaya.dev/en/writeups/how-i-write-hackerone-reports"');
  });

  it('renders the English post with code blocks and localized links', async () => {
    const paths = await getEnStaticPaths();
    const target = paths.find((p) => p.params.slug === 'android-exported-components')!;
    const container = await AstroContainer.create();
    const html = await container.renderToString(EnWriteupPage, {
      params: target.params,
      props: target.props,
      request: new Request('https://harukakaya.dev/en/writeups/android-exported-components'),
      partial: false,
    });

    expect(html).toContain('<html lang="en"');
    expect(html).toContain('<pre');
    expect(html).toContain('href="/en/writeups"');
    expect(html).toContain('min read');
  });
});
