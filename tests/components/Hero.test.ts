import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Hero from '../../src/components/Hero.astro';

const baseProps = {
  lang: 'ja' as const,
  name: '賀屋 悠',
  tagline: 'ものを作りながら、仕組みの境界を調べています。',
  roles: ['セキュリティリサーチャー', 'HackerOne'],
  location: '日本',
  avatar: 'https://example.com/avatar.png',
  hackerone: 'https://hackerone.com/haruka-kaya',
  github: 'https://github.com/Haruka-Kaya',
};

describe('Hero', () => {
  it('renders the name, tagline, roles, and constellation canvas', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero, { props: baseProps });

    expect(html).toContain('賀屋 悠');
    expect(html).toContain(baseProps.tagline);
    expect(html).toContain('セキュリティリサーチャー');
    expect(html).toContain('日本');
    expect(html).toContain('data-constellation');
    expect(html).toContain(`src="${baseProps.avatar}"`);
    expect(html).toContain('href="/writeups"');
    expect(html).toContain(`href="${baseProps.hackerone}"`);
  });

  it('renders English copy and localized links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero, { props: { ...baseProps, lang: 'en', hackerone: '' } });

    expect(html).toContain('Read writeups');
    expect(html).toContain('href="/en/writeups"');
    expect(html).toContain('Find where it breaks.');
    expect(html).not.toContain('hackerone.com');
  });
});
