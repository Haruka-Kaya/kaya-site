import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Nav from '../../src/components/Nav.astro';

describe('Nav', () => {
  it('renders the site name with an accessible home link', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav, {
      props: { name: '賀屋 悠' },
    });

    expect(html).toContain('賀屋 悠');
    expect(html).toContain('aria-label="賀屋 悠のトップページ"');
    expect(html).toContain('href="/"');
  });

  it('renders all section links and the contact link', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav, {
      props: { name: '賀屋 悠' },
    });

    for (const href of ['/#security', '/#projects', '/#about', '/#likes', '/#contact']) {
      expect(html).toContain(`href="${href}"`);
    }
  });
});
