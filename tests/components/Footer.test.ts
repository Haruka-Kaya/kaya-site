import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Footer from '../../src/components/Footer.astro';

const baseProps = {
  name: '賀屋 悠',
  github: 'https://github.com/Haruka-Kaya',
  email: 'me@example.com',
  twitter: 'https://x.com/example',
  hackerone: 'https://hackerone.com/haruka-kaya',
};

describe('Footer', () => {
  it('renders all contact actions when every link is provided', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: baseProps });

    expect(html).toContain(`href="${baseProps.hackerone}"`);
    expect(html).toContain('href="mailto:me@example.com"');
    expect(html).toContain(`href="${baseProps.github}"`);
    expect(html).toContain(`href="${baseProps.twitter}"`);
  });

  it('omits optional actions when links are missing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, {
      props: { name: '賀屋 悠', github: '', email: '', twitter: '', hackerone: '' },
    });

    expect(html).not.toContain('mailto:');
    expect(html).not.toContain('HackerOneを見る');
    expect(html).not.toContain('GitHubを見る');
    expect(html).not.toContain('Xを見る');
  });

  it('renders the current year and name in the copyright line', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, { props: baseProps });

    expect(html).toContain(`© ${new Date().getFullYear()}`);
    expect(html).toContain('賀屋 悠');
  });
});
