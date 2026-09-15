import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Footer from '../../src/components/Footer.astro';

const settings = {
  name: '賀屋 悠',
  github: 'https://github.com/Haruka-Kaya',
  hackerone: 'https://hackerone.com/haruka-kaya',
  email: 'me@example.com',
  twitter: 'https://x.com/example',
};

describe('Footer', () => {
  it('renders every contact action with external links opening in a new tab', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: { lang: 'ja', settings } });

    expect(html).toContain('id="contact"');
    expect(html).toContain('href="mailto:me@example.com"');
    expect(html).toContain(`href="${settings.hackerone}"`);
    expect(html).toContain(`href="${settings.github}"`);
    expect(html).toContain(`href="${settings.twitter}"`);
    expect((html.match(/rel="noopener noreferrer"/g) ?? []).length).toBe(3);
    expect(html).toContain(String(new Date().getFullYear()));
  });

  it('omits actions whose settings are empty and translates copy', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, {
      props: { lang: 'en', settings: { ...settings, hackerone: '', twitter: '' } },
    });

    expect(html).not.toContain('hackerone.com');
    expect(html).not.toContain('x.com');
    expect(html).toContain('Say hello.');
    expect(html).toContain('Back to top');
  });
});
