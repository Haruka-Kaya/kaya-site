import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { createReader } from '@keystatic/core/reader';
import { describe, expect, it } from 'vitest';
import HobbyPage, { getStaticPaths } from '../../src/pages/hobbies/[slug].astro';
import EnHobbyPage, { getStaticPaths as getEnStaticPaths } from '../../src/pages/[lang]/hobbies/[slug].astro';
import keystaticConfig from '../../keystatic.config';

describe('hobby page', () => {
  it('getStaticPaths returns params for every hobby in both locales', async () => {
    const reader = createReader(process.cwd(), keystaticConfig);
    const slugs = [...(await reader.collections.hobbies.list())].sort();

    const ja = await getStaticPaths();
    expect(ja.map((p) => p.params.slug).sort()).toEqual(slugs);

    const en = await getEnStaticPaths();
    expect(en.every((p) => p.params.lang === 'en')).toBe(true);
    expect(en.map((p) => p.params.slug).sort()).toEqual(slugs);
  });

  it('renders a Japanese hobby page with detail paragraphs and back links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HobbyPage, {
      params: { slug: 'fpvdrone' },
      request: new Request('https://harukakaya.dev/hobbies/fpvdrone'),
      partial: false,
    });

    expect(html).toContain('<html lang="ja"');
    expect(html).toContain('<title>ドローン | 賀屋 悠</title>');
    expect(html).toContain('href="/#interests"');
    expect(html).toContain('rel="canonical" href="https://harukakaya.dev/hobbies/fpvdrone"');
    expect(html).toContain('hreflang="en" href="https://harukakaya.dev/en/hobbies/fpvdrone"');
    expect((html.match(/class="hobby-detail/g) ?? []).length).toBe(1);
  });

  it('renders the English hobby page with translated content', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EnHobbyPage, {
      params: { lang: 'en', slug: 'fpvdrone' },
      request: new Request('https://harukakaya.dev/en/hobbies/fpvdrone'),
      partial: false,
    });

    expect(html).toContain('<html lang="en"');
    expect(html).toContain('<title>Drones | Haruka Kaya</title>');
    expect(html).toContain('href="/en/#interests"');
    expect(html).toContain('Back to interests');
  });
});
