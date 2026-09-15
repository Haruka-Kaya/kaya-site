import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Hero from '../../src/components/Hero.astro';

const baseProps = {
  lang: 'ja' as const,
  name: '賀屋 悠',
  altName: 'Haruka Kaya',
  tagline: 'ものを作りながら、仕組みの境界を調べています。',
  roles: ['セキュリティリサーチャー', 'HackerOne'],
  location: '日本',
  focus: ['Android', 'Web & API', 'AI Agents'],
  hackerone: 'https://hackerone.com/haruka-kaya',
  github: 'https://github.com/Haruka-Kaya',
  twitter: 'https://x.com/HarukaKayaDev',
};

describe('Hero', () => {
  it('renders the name, tagline, roles, profile card, and constellation canvas without any image', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero, { props: baseProps });

    expect(html).toContain('賀屋 悠');
    expect(html).toContain('Haruka Kaya');
    expect(html).toContain(baseProps.tagline);
    expect(html).toContain('セキュリティリサーチャー');
    expect(html).toContain('日本');
    expect(html).toContain('Android / Web &amp; API / AI Agents');
    expect(html).toContain('data-constellation');
    expect(html).not.toContain('<img');
    expect(html).toContain('href="/writeups"');
    expect(html).toContain(`href="${baseProps.github}"`);
    expect(html).toContain(`href="${baseProps.twitter}"`);
  });

  it('renders English copy and hides links whose URLs are empty', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero, { props: { ...baseProps, lang: 'en', hackerone: '', twitter: '' } });

    expect(html).toContain('Read writeups');
    expect(html).toContain('href="/en/writeups"');
    expect(html).toContain('Find where it breaks.');
    expect(html).not.toContain('hackerone.com');
    expect(html).not.toContain('x.com');
  });
});
