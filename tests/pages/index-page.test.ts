import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import IndexPage from '../../src/pages/index.astro';
import EnIndexPage, { getStaticPaths } from '../../src/pages/[...lang]/index.astro';

async function renderHome(lang: 'ja' | 'en') {
  const container = await AstroContainer.create();
  if (lang === 'ja') {
    return container.renderToString(IndexPage, { request: new Request('https://harukakaya.dev/'), partial: false });
  }
  return container.renderToString(EnIndexPage, {
    params: { lang: 'en' },
    request: new Request('https://harukakaya.dev/en/'),
    partial: false,
  });
}

describe('home page', () => {
  it('only generates prefixed paths for the English locale', () => {
    expect(getStaticPaths()).toEqual([{ params: { lang: 'en' } }]);
  });

  it('renders every section in Japanese with hreflang alternates', async () => {
    const html = await renderHome('ja');

    expect(html).toContain('<html lang="ja"');
    expect(html).toContain('<title>');
    expect(html).toContain('id="about"');
    expect(html).toContain('id="security"');
    expect(html).toContain('id="writeups"');
    expect(html).toContain('id="projects"');
    expect(html).toContain('id="interests"');
    expect(html).toContain('id="contact"');
    expect(html).toContain('hreflang="en" href="https://harukakaya.dev/en/"');
    expect(html).toContain('hreflang="x-default"');
    expect(html).toContain('rel="canonical" href="https://harukakaya.dev/"');
  });

  it('renders four featured projects, six featured interests, and three writeups', async () => {
    const html = await renderHome('ja');

    expect((html.match(/class="project-card/g) ?? []).length).toBe(4);
    expect((html.match(/class="like-card/g) ?? []).length).toBe(6);
    expect((html.match(/class="writeup-card/g) ?? []).length).toBe(3);
    expect(html).toContain('writeup-card--featured');
  });

  it('includes JSON-LD person schema with social profiles', async () => {
    const html = await renderHome('ja');

    expect(html).toContain('application/ld+json');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('hackerone.com');
    expect(html).toContain('data-constellation');
  });

  it('renders the English home with localized copy and links', async () => {
    const html = await renderHome('en');

    expect(html).toContain('<html lang="en"');
    expect(html).toContain('Haruka Kaya');
    expect(html).toContain('href="/en/writeups"');
    expect(html).toContain('href="/en/projects"');
    expect(html).toContain('href="/en/hobbies/fpvdrone"');
    expect(html).toContain('hreflang="ja" href="https://harukakaya.dev/"');
    expect(html).toContain('rel="canonical" href="https://harukakaya.dev/en/"');
    expect(html).toContain('Find where it breaks.');
    expect(html).not.toContain('もう少し詳しく');
  });
});
