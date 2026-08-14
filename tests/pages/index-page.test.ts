import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import IndexPage from '../../src/pages/index.astro';

describe('index page', () => {
  it('renders the homepage with all main sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(IndexPage, {
      request: new Request('https://harukakaya.dev/'),
      partial: false,
    });

    expect(html).toContain('<title>');
    expect(html).toContain('id="projects"');
    expect(html).toContain('id="likes"');
    expect(html).toContain('id="about"');
    expect(html).toContain('id="security"');
    expect(html).toContain('id="contact"');
  });

  it('renders the four featured projects in order', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(IndexPage, {
      request: new Request('https://harukakaya.dev/'),
      partial: false,
    });

    const cardCount = (html.match(/class="project-card/g) ?? []).length;
    expect(cardCount).toBe(4);
  });

  it('includes SEO metadata and JSON-LD person schema', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(IndexPage, {
      request: new Request('https://harukakaya.dev/'),
      partial: false,
    });

    expect(html).toContain('application/ld+json');
    expect(html).toContain('"@type":"Person"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('rel="canonical"');
  });
});
