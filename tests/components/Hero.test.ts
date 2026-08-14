import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Hero from '../../src/components/Hero.astro';

const baseProps = {
  name: '賀屋 悠',
  tagline: 'ドローンとLinuxが好き',
  avatar: 'https://github.com/Haruka-Kaya.png?size=420',
  hackerone: 'https://hackerone.com/haruka-kaya',
};

describe('Hero', () => {
  it('renders the name and tagline', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero, { props: baseProps });

    expect(html).toContain('賀屋 悠');
    expect(html).toContain('ドローンとLinuxが好き');
  });

  it('renders the avatar image with accessible alt text', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero, { props: baseProps });

    expect(html).toContain(`src="${baseProps.avatar}"`);
    expect(html).toContain('alt="賀屋 悠のプロフィール画像"');
  });

  it('falls back to an initial when no avatar is set', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero, {
      props: { ...baseProps, avatar: '' },
    });

    expect(html).not.toContain('<img');
    expect(html).toContain('profile-initial');
  });

  it('renders the HackerOne button only when a link is provided', async () => {
    const container = await AstroContainer.create();
    const withLink = await container.renderToString(Hero, { props: baseProps });
    const withoutLink = await container.renderToString(Hero, {
      props: { ...baseProps, hackerone: undefined },
    });

    expect(withLink).toContain(`href="${baseProps.hackerone}"`);
    expect(withoutLink).not.toContain('hackerone.com');
  });
});
