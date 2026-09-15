import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import HobbyCard from '../../src/components/HobbyCard.astro';

const baseProps = {
  lang: 'ja' as const,
  name: 'ドローン',
  description: '説明文',
  icon: '🚁',
  slug: 'fpvdrone',
  index: 2,
};

describe('HobbyCard', () => {
  it('renders the icon, name, description, and zero-padded index', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HobbyCard, { props: baseProps });

    expect(html).toContain('🚁');
    expect(html).toContain('ドローン');
    expect(html).toContain('説明文');
    expect(html).toContain('02');
    expect(html).toContain('もう少し詳しく');
  });

  it('links to the localized hobby page', async () => {
    const container = await AstroContainer.create();
    const ja = await container.renderToString(HobbyCard, { props: baseProps });
    const en = await container.renderToString(HobbyCard, { props: { ...baseProps, lang: 'en', name: 'Drones' } });

    expect(ja).toContain('href="/hobbies/fpvdrone"');
    expect(en).toContain('href="/en/hobbies/fpvdrone"');
    expect(en).toContain('Read more');
  });
});
