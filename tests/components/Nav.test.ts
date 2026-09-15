import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Nav from '../../src/components/Nav.astro';

describe('Nav', () => {
  it('renders Japanese links and a switch to the English page', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav, { props: { lang: 'ja', name: '賀屋 悠', alternatePath: '/writeups' } });

    expect(html).toContain('賀屋 悠');
    expect(html).toContain('href="/#about"');
    expect(html).toContain('href="/writeups"');
    expect(html).toContain('href="/projects"');
    expect(html).toContain('href="/en/writeups"');
    expect(html).toContain('hreflang="en"');
    expect(html).toContain('data-theme-toggle');
    expect(html).toContain('data-menu-toggle');
  });

  it('renders English links and a switch back to Japanese', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav, { props: { lang: 'en', name: 'Haruka Kaya', alternatePath: '/' } });

    expect(html).toContain('href="/en/#about"');
    expect(html).toContain('href="/en/writeups"');
    expect(html).toContain('href="/"');
    expect(html).toContain('hreflang="ja"');
    expect(html).toContain('Profile');
  });
});
